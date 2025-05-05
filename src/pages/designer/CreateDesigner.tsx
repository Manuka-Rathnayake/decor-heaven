import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, setDoc, getDocs } from "firebase/firestore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
import { auth } from "@/config/firebase";
import { firestore as db } from "@/config/firebase";
import Sidebar from "@/components/designer/Sidebar";

const createDesignerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type CreateDesignerSchema = z.infer<typeof createDesignerSchema>;

type Designer = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

const CreateDesigner = () => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [loadingDesigners, setLoadingDesigners] = useState(true);

  const form = useForm<CreateDesignerSchema>({
    resolver: zodResolver(createDesignerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const fetchDesigners = async () => {
    try {
      const snapshot = await getDocs(collection(db, "designers"));
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Designer[];
      setDesigners(list);
    } catch (err) {
      console.error("Failed to fetch designers:", err);
    } finally {
      setLoadingDesigners(false);
    }
  };

  useEffect(() => {
    fetchDesigners();
  }, []);

  const onSubmit = async (data: CreateDesignerSchema) => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const user = userCredential.user;

      await setDoc(doc(db, "designers", user.uid), {
        uid: user.uid,
        name: data.name,
        email: data.email,
        role: "designer",
        createdAt: new Date().toISOString(),
      });

      setSuccessMessage("Designer account created successfully!");
      form.reset();
      fetchDesigners(); // refresh table
    } catch (error: any) {
      console.error("Create Designer Error:", error);
      setErrorMessage(error.message || "Failed to create designer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Sidebar collapsed={collapsed} toggleSidebar={() => setCollapsed(!collapsed)} />
      <main className="flex-1 bg-muted p-6 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Create Designer</h1>

        <div className="max-w-xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
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
                      <Input placeholder="designer@example.com" {...field} />
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
                      <Input type="password" placeholder="Password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {errorMessage && (
                <p className="text-sm text-red-600">{errorMessage}</p>
              )}
              {successMessage && (
                <p className="text-sm text-green-600">{successMessage}</p>
              )}

              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create"}
              </Button>
            </form>
          </Form>
        </div>

        {/* Designers Table */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-4">Registered Designers</h2>
          {loadingDesigners ? (
            <p className="text-sm text-muted-foreground">Loading designers...</p>
          ) : designers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No designers registered yet.</p>
          ) : (
            <div className="overflow-x-auto border rounded-lg">
              <table className="min-w-full text-sm">
                <thead className="bg-muted text-muted-foreground text-left">
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Email</th>
                    <th className="px-4 py-2">Role</th>
                    <th className="px-4 py-2">Created At</th>
                  </tr>
                </thead>
                <tbody className="bg-background">
                  {designers.map((designer) => (
                    <tr key={designer.id} className="border-t">
                      <td className="px-4 py-2">{designer.name}</td>
                      <td className="px-4 py-2">{designer.email}</td>
                      <td className="px-4 py-2">{designer.role}</td>
                      <td className="px-4 py-2 text-muted-foreground">
                        {new Date(designer.createdAt).toLocaleDateString()}
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
  );
};

export default CreateDesigner;







// import { useState } from "react";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { collection, doc, setDoc } from "firebase/firestore";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";

// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { auth } from "@/config/firebase";
// import { firestore as db } from "@/config/firebase";
// import Sidebar from "@/components/designer/Sidebar";

// const createDesignerSchema = z.object({
//   name: z.string().min(2, "Name is required"),
//   email: z.string().email("Enter a valid email"),
//   password: z.string().min(6, "Password must be at least 6 characters"),
// });

// type CreateDesignerSchema = z.infer<typeof createDesignerSchema>;

// const CreateDesigner = () => {
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const [successMessage, setSuccessMessage] = useState("");
//   const [collapsed, setCollapsed] = useState(false);

//   const form = useForm<CreateDesignerSchema>({
//     resolver: zodResolver(createDesignerSchema),
//     defaultValues: {
//       name: "",
//       email: "",
//       password: "",
//     },
//   });

//   const onSubmit = async (data: CreateDesignerSchema) => {
//     setLoading(true);
//     setErrorMessage("");
//     setSuccessMessage("");

//     try {
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         data.email,
//         data.password
//       );

//       const user = userCredential.user;

//       // Add to Firestore designers collection
//       await setDoc(doc(db, "designers", user.uid), {
//         uid: user.uid,
//         name: data.name,
//         email: data.email,
//         role: "designer",
//         createdAt: new Date(),
//       });

//       setSuccessMessage("Designer account created successfully!");
//       form.reset();
//     } catch (error: any) {
//       console.error("Create Designer Error:", error);
//       setErrorMessage(error.message || "Failed to create designer.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex">
//       <Sidebar collapsed={collapsed} toggleSidebar={() => setCollapsed(!collapsed)} />
//       <main className="flex-1 bg-muted p-6 min-h-screen">
//         <h1 className="text-2xl font-bold mb-6">Create Designer</h1>

//         <div className="max-w-xl">
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//               <FormField
//                 control={form.control}
//                 name="name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Full Name</FormLabel>
//                     <FormControl>
//                       <Input placeholder="John Doe" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Email</FormLabel>
//                     <FormControl>
//                       <Input placeholder="designer@example.com" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="password"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Password</FormLabel>
//                     <FormControl>
//                       <Input type="password" placeholder="Password" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               {errorMessage && (
//                 <p className="text-sm text-red-600">{errorMessage}</p>
//               )}
//               {successMessage && (
//                 <p className="text-sm text-green-600">{successMessage}</p>
//               )}

//               <Button type="submit" disabled={loading}>
//                 {loading ? "Creating..." : "Create"}
//               </Button>
//             </form>
//           </Form>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default CreateDesigner;


















// import { useState } from "react";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";

// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { auth } from "@/config/firebase";

// const createDesignerSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(6),
// });

// type CreateDesignerSchema = z.infer<typeof createDesignerSchema>;

// const CreateDesigner = () => {
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   const form = useForm<CreateDesignerSchema>({
//     resolver: zodResolver(createDesignerSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const onSubmit = async (data: CreateDesignerSchema) => {
//     setLoading(true);
//     setErrorMessage("");
//     try {
//       await createUserWithEmailAndPassword(auth, data.email, data.password);
//     } catch (error: any) {
//       setErrorMessage(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <div>
//       <h1>Create Designer</h1>
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//           <FormField
//             control={form.control}
//             name="email"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Email</FormLabel>
//                 <FormControl>
//                   <Input placeholder="example@example.com" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={form.control}
//             name="password"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Password</FormLabel>
//                 <FormControl>
//                   <Input type="password" placeholder="password" {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <Button type="submit" disabled={loading}>
//             {loading ? "Creating..." : "Create"}
//           </Button>
//           {errorMessage && <div>{errorMessage}</div>}
//         </form>
//       </Form>
//     </div>
//   );
// };

// export default CreateDesigner;



