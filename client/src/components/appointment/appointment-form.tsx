import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { TIME_SLOTS } from "@/lib/constants";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload } from "lucide-react";
import { format } from "date-fns";

// Form validation schema
const formSchema = z.object({
  firstName: z.string().min(2, { message: "First name is required" }),
  lastName: z.string().min(2, { message: "Last name is required" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  date: z.date({ required_error: "Please select a date" }),
  time: z.string({ required_error: "Please select a time" }),
  meetingLink: z.string().optional(),
  notes: z.string().optional(),
  referenceImages: z.array(z.string()).optional(),
});

const AppointmentForm = () => {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: user?.fullName?.split(' ')[0] || '',
      lastName: user?.fullName?.split(' ').slice(1).join(' ') || '',
      email: user?.email || '',
      meetingLink: '',
      notes: '',
      referenceImages: [],
    }
  });
  
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/online-appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id || 0,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          date: format(data.date, 'yyyy-MM-dd'),
          time: data.time,
          meetingLink: data.meetingLink || '',
          notes: data.notes || '',
          referenceImages: data.referenceImages || [],
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to book online appointment');
      }
      
      form.reset();
      
      toast({
        title: "Appointment Scheduled",
        description: "Your virtual consultation has been scheduled. We'll send a confirmation email shortly.",
      });
    } catch (error) {
      console.error('Appointment booking error:', error);
      toast({
        title: "Booking Failed",
        description: "There was a problem scheduling your virtual consultation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // This is just for UI demonstration as we can't upload files directly
  const handleImageUpload = () => {
    toast({
      title: "Image Upload",
      description: "Image upload functionality would be implemented here with proper file handling.",
    });
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email Address</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Preferred Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={`
                          w-full pl-3 text-left font-normal
                          ${!field.value && "text-muted-foreground"}
                        `}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 1))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred Time</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a time" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TIME_SLOTS.map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="meetingLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Google Meet Link (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g., https://meet.google.com/abc-defg-hij" {...field} />
              </FormControl>
              <FormMessage />
              <p className="text-sm text-muted-foreground mt-1">
                You can provide your own meeting link or we can generate one for you.
              </p>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Please describe your style preferences or specific requirements" 
                  rows={3} 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-2">
          <FormLabel>Reference Images (Optional)</FormLabel>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleImageUpload}
              className="mx-auto flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              <span>Upload Images</span>
            </Button>
            <p className="text-sm text-muted-foreground mt-2">
              Upload images for reference during your consultation
            </p>
          </div>
        </div>
        
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full py-3 bg-[#C8A96A] hover:bg-[#B08D4C] text-white font-medium transition-custom h-auto"
        >
          {isSubmitting ? "Scheduling..." : "Book Virtual Consultation"}
        </Button>
      </form>
    </Form>
  );
};

export default AppointmentForm;
