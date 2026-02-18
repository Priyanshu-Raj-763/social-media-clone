import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
          <h1 className="text-6xl font-bold tracking-tight">404</h1>

          <h2 className="text-xl font-semibold">
            Page not found
          </h2>

          <p className="text-sm text-muted-foreground">
            The page you’re looking for doesn’t exist or was moved.
          </p>

          <div className="flex gap-3 pt-2">
            <Button
              variant="default"
              onClick={() => navigate("/")}
            >
              Go Home
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
