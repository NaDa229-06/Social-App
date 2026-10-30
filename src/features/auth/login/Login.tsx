
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, TextInput} from "flowbite-react";
import { HiMail, HiLockClosed } from "react-icons/hi";
import { ImSpinner } from "react-icons/im";
import { loginSchema, type LoginFormData } from "./login.schema";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { signIn } from "./login.api";
import { useNavigate } from "react-router-dom";
import { authContext } from "../../../contexts/auth.context";


export default function Login() {
  const navigate = useNavigate();
   const [isLoading,setLoading] = useState(false)
   const context =useContext(authContext)
   if(!context) throw new Error("")
    const {setLogin} =context
  const {
    register,
    handleSubmit,
    formState: { errors},
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData){
       setLoading(true)
      try{
         const res= await signIn(data)
         if(res?.success){
          localStorage.setItem("tkn",res?.data?.token);
          setLogin(res?.data?.token)
          toast.success(res?.message)
          navigate("/feed")
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
          id="login-email"
          type="email"
          placeholder="name@company.com"
          icon={HiMail}
          {...register("email")}
        />
        <span className="mt-1.5 block text-xs font-medium text-red-600">{errors.email?.message}</span>
      </div>

      <div>
        <TextInput
          id="login-password"
          type="password"
          icon={HiLockClosed}
          {...register("password")}
        />
        <span className="mt-1.5 block text-xs font-medium text-red-600">{errors.password?.message}</span>
      </div>

     <Button type="submit" disabled={isLoading} className="w-full bg-[#00298d]">
            {isLoading ? <ImSpinner /> : "Login"}
          </Button>

      <button
        type="button"
        className="mx-auto block text-sm font-semibold text-[#00298d] transition hover:underline"
      >
        Forgot password?
      </button>
    </form>
  );
}