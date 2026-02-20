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
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLoggedInUser } from "@/store/authSlice.js";
import api from "@/lib/axios";
import ThemeToggleBtn from "@/components/ThemeToggleBtn";

const Login = () => {
  const dispatch = useDispatch()
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const handleLogin = async (data) => {
    try {
      setIsLoading(true)
      const response = await api.post("/user/login", data);
      if (response.data.success) {
        reset()
        toast.success(response.data.message);
        dispatch(setLoggedInUser(response.data.data))
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
    <div className="min-h-screen bg-background flex items-center justify-center px-4 ">
      <Card className={"w-full max-w-md bg-card text-foreground z-10"}>
        <CardHeader>
          <div className="text-xl   flex w-full justify-between items-center">
            <CardTitle>Login to Your Account</CardTitle>
            <ThemeToggleBtn />
          </div>
          <CardDescription>login to see your friends post</CardDescription>
        </CardHeader>
        <CardContent>

          <form onSubmit={handleSubmit(handleLogin)} className="space-y-4" >
            <div>
              <Label htmlFor="email" className={"m-2 text-lg"}>Email</Label>
              <Input type={"email"} placeholder="Enter your email" id="email" name="email" className={"px-2 py-1 "} {...register("email", {
                required: "Email is required"
              })} />
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.email.message}
                </p>)}
            </div>
            <div>
              <Label htmlFor="password" className={"m-2 text-lg"}>Password</Label>
              <Input type={"password"} placeholder="Enter your password" id="password" name="password" className={"px-2 py-1"} {...register("password", {
                required: "Password is required"
              })} />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.password.message}
                </p>)}
            </div>
            <div className={"flex justify-center"}>
              <Button className={"cursor-pointer"} size="lg" type="submit" disabled={isLoading} >{isLoading ? "Logging.." : "Login"}</Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className={""}>
          <p className="mx-auto text-foreground">Doesn't have an account? <Link className="text-primary" to={"/signup"}>Signup</Link>  </p>
        </CardFooter>
      </Card>

    </div>
  )
}

export default Login
