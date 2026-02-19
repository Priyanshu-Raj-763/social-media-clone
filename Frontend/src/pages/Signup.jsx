import { useForm } from "react-hook-form"
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from "sonner";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/lib/axios";
import ThemeToggleBtn from "@/components/ThemeToggleBtn";

const Signup = () => {
  const navigate = useNavigate()
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const handleSignup = async (data) => {
    try {
      setIsLoading(true)
      const response = await api.post("/user/register", data,{
        withCredentials:true
      })
      if (response.data.success) {
        reset()
        toast.success(response.data.message)
        navigate("/login")
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Something went wrong"
        );
      } else {
        toast.error("Unexpected error");
      }
    } finally {
      setIsLoading(false)
    }

  }
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className={"w-full max-w-md bg-card text-foreground"}>
        <CardHeader>
          <div className="flex w-full justify-between items-center text-xl">
          <CardTitle>Signup to Create your Account</CardTitle>
          <ThemeToggleBtn/>
          </div>
          <CardDescription>Welcome to our App</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleSignup)} className="space-y-4" >
            <div>
              <Label htmlFor="username" className={"m-2 text-lg"}>Username</Label>
              <Input type={"text"} placeholder="Enter your username" id="username" name="username" className={"px-2 py-1"} {...register("username", {
                required: "Username is required"
              })} />
              {errors.username && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.username.message}
                </p>)}
            </div>
            <div>
              <Label htmlFor="email" className={"m-2 text-lg"}>Email</Label>
              <Input type={"email"} placeholder="Enter your email" id="email" name="email" className={"px-2 py-1"} {...register("email", {
                required: "Email is required"
              })} />
              {errors.username && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>)}
            </div>
            <div>
              <Label htmlFor="password" className={"m-2 text-lg"}>Password</Label>
              <Input type={"password"} placeholder="Enter your password" id="password" name="password" className={"px-2 py-1"} {...register("password", {
                required: "Password is required"
              })} />
              {errors.username && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.password.message}
                </p>)}
            </div>
             <div className="flex justify-center">
             <Button size="lg" type="submit" disabled={isLoading} >{isLoading ? "Signing.." : "Signup"}</Button>
             </div>
          </form>
        </CardContent>
        <CardFooter className={""}>
            <p className="mx-auto text-foreground">ALready have an account? <Link className="text-primary" to={"/login"}>Login</Link> </p>
          </CardFooter>
      </Card>
    </div>
  )
}

export default Signup
