import React, { useState, useEffect } from "react"; // Import React
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils"; // Import cn utility

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { auth } from "@/config/firebase"; // Assuming auth is exported directly
import { firestore as db } from "@/config/firebase"; // Assuming db is exported as firestore
import Sidebar from "@/components/designer/Sidebar"; // Verify path

// Zod Schema for form validation
const createDesignerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"), // Adjusted message
  email: z.string().email("Invalid email address"), // Adjusted message
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// TypeScript type inferred from the schema
type CreateDesignerSchema = z.infer<typeof createDesignerSchema>;

// TypeScript type for designer data fetched from Firestore
type Designer = {
  id: string; // Document ID from Firestore
  uid: string; // User ID from Firebase Auth
  name: string;
  email: string;
  role: string;
  createdAt: string; // ISO date string
};

const CreateDesigner: React.FC = () => {
  // Add React.FC type
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [collapsed, setCollapsed] = useState(false); // Sidebar state
  const [designers, setDesigners] = useState<Designer[]>([]); // List of designers
  const [loadingDesigners, setLoadingDesigners] = useState(true); // Loading state for table

  // React Hook Form setup
  const form = useForm<CreateDesignerSchema>({
    resolver: zodResolver(createDesignerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // Function to fetch existing designers
  const fetchDesigners = async () => {
    setLoadingDesigners(true); // Set loading true when fetching starts
    try {
      const snapshot = await getDocs(collection(db, "designers"));
      // Map Firestore docs to Designer type, ensuring all fields exist
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Designer, "id">), // Assume data matches type structure
      }));
      setDesigners(list);
    } catch (err) {
      console.error("Failed to fetch designers:", err);
      setErrorMessage("Failed to load existing designers."); // Show error to user
    } finally {
      setLoadingDesigners(false); // Set loading false when fetching ends
    }
  };

  // Fetch designers on component mount
  useEffect(() => {
    fetchDesigners();
  }, []);

  // Function to handle form submission
  const onSubmit = async (data: CreateDesignerSchema) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
    try {
      // 1. Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const user = userCredential.user;

      // 2. Create designer document in Firestore
      await setDoc(doc(db, "designers", user.uid), {
        uid: user.uid,
        name: data.name,
        email: data.email,
        role: "designer", // Assign role
        createdAt: new Date().toISOString(), // Timestamp
      });

      setSuccessMessage("Designer account created successfully!");
      form.reset(); // Clear the form
      fetchDesigners(); // Refresh the table
    } catch (error: any) {
      console.error("Create Designer Error:", error);
      // Provide more specific error messages if possible
      if (error.code === "auth/email-already-in-use") {
        setErrorMessage("This email address is already in use.");
      } else {
        setErrorMessage(
          error.message || "Failed to create designer. Please try again."
        );
      }
    } finally {
      setLoading(false); // Ensure loading is set to false
    }
  };

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // --- Return Corrected JSX Structure ---
  return (
    <div className="flex min-h-screen bg-background">
      {" "}
      {/* Outermost container */}
      <Sidebar collapsed={collapsed} toggleSidebar={toggleSidebar} />
      {/* Main Content Wrapper */}
      <div
        className={cn(
          "flex-1 flex flex-col h-full", // Basic wrapper styles
          collapsed ? "ml-16" : "ml-64", // Dynamic margin for fixed sidebar
          "transition-all duration-300 ease-in-out" // Smooth transition
        )}
      >
        {/* Optional Header can go here */}
        {/* <DesignerHeader collapsed={collapsed} /> */}

        {/* Main Content Area */}
        <main className="flex-1 bg-muted p-6 overflow-y-auto">
          {" "}
          {/* Scrolling area */}
          {/* Page Title */}
          <h1 className="text-2xl font-bold mb-6">Create Designer</h1>
          {/* Form Section */}
          <div className="max-w-xl mb-10">
            {" "}
            {/* Constrain form width & add bottom margin */}
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter designer's full name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="designer@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Create a password (min. 6 characters)"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Error and Success Messages */}
                {errorMessage && (
                  <p className="text-sm font-medium text-destructive">
                    {errorMessage}
                  </p> // Use theme color
                )}
                {successMessage && (
                  <p className="text-sm font-medium text-green-600">
                    {successMessage}
                  </p> // Consider theme color
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto"
                >
                  {" "}
                  {/* Responsive width */}
                  {loading ? "Creating..." : "Create Designer Account"}
                </Button>
              </form>
            </Form>
          </div>
          {/* Designers Table Section */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Registered Designers</h2>{" "}
            {/* Increased heading size */}
            {loadingDesigners ? (
              <p className="text-muted-foreground">Loading designers...</p>
            ) : designers.length === 0 ? (
              <div className="border rounded-lg p-6 text-center bg-card">
                <p className="text-muted-foreground">
                  No designers have been registered yet.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto border rounded-lg bg-card shadow-sm">
                <table className="min-w-full text-sm divide-y divide-border">
                  <thead className="bg-muted/50">
                    <tr>
                      <th
                        scope="col"
                        className="px-4 py-3 font-medium text-muted-foreground text-left"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 font-medium text-muted-foreground text-left"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 font-medium text-muted-foreground text-left"
                      >
                        Role
                      </th>
                      <th
                        scope="col"
                        className="px-4 py-3 font-medium text-muted-foreground text-left"
                      >
                        Created At
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {designers.map((designer) => (
                      <tr
                        key={designer.id}
                        className="hover:bg-muted/50 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-foreground">
                          {designer.name}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {designer.email}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {designer.role}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {/* Format date nicely */}
                          {new Date(designer.createdAt).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "short", day: "numeric" }
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateDesigner;
