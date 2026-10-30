
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button,TextInput,Select} from "flowbite-react";
import { HiUser, HiMail, HiLockClosed } from "react-icons/hi";
import { ImSpinner } from "react-icons/im";
import { registerSchema, type RegisterFormData } from "./register.schema";
import { signUp } from "./register.api";
import { toast } from "react-toastify";
import { useState } from "react";

// interface RegisterProps {
//   setActiveTab: (tab: "login" | "register") => void;
// }
// { setActiveTab }: RegisterProps

export default function Register() {
  const [isLoading,setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors},
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterFormData){
    setLoading(true)
   try{
      const res= await signUp(data)
      if(res?.success){
        toast.success(res?.message)
        // setActiveTab("login")
      }
   }catch(error:any){
     toast.error(error.response.data.message)
   }finally{
    setLoading(false)
   }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
      <div>
        <TextInput
          id="name"
          type="text"
          placeholder="Name"
          icon={HiUser}
          {...register("name")}

        />
      <span className="mt-1.5 block text-xs font-medium text-red-600">{errors.name?.message}</span>
      </div>
    <div>
        <TextInput
          id="username"
          type="text"
          placeholder="Username"
          icon={HiUser}
          {...register("username")}

        />
        <span className="mt-1.5 block text-xs font-medium text-red-600">{errors.username?.message}</span>
      </div>

      <div>
        <TextInput
          id="email"
          type="email"
          placeholder="name@company.com"
          icon={HiMail}
          {...register("email")}

        />
        <span className="mt-1.5 block text-xs font-medium text-red-600">{errors.email?.message}</span>
      </div>

       <div>
        <TextInput
          id="dateOfBirth"
          type="date"
          placeholder="DateOfBirth"
          // icon={HiUser}
          {...register("dateOfBirth")}

        />
        <span className="mt-1.5 block text-xs font-medium text-red-600">{errors.dateOfBirth?.message}</span>
      </div>
          
      <Select {...register("gender")} id="gender">
        <option value={"male"}>Male</option>
        <option value={"female"}>Female</option>
      </Select>

      <div>
        <TextInput
          id="password"
          type="password"
          icon={HiLockClosed}
          {...register("password")}

        />
        <span className="mt-1.5 block text-xs font-medium text-red-600">{errors.password?.message}</span>
      </div>
      <div>
        <TextInput
          id="repassword"
          type="password"
          icon={HiLockClosed}
          {...register("rePassword")}
        />
        <span className="mt-1.5 block text-xs font-medium text-red-600">{errors.rePassword?.message}</span>
      </div>


      <Button type="submit" disabled={isLoading} className="w-full bg-[#00298d]">
        {isLoading ? <ImSpinner /> : "Register"}
      </Button>
    </form>
  );
}