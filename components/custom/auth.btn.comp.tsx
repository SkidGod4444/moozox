import React from "react";
import { Button } from "../ui/button";
import { LogIn } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { signIn } from "next-auth/react";
import {
  IconBrandGoogleFilled,
  IconBrandTwitterFilled,
} from "@tabler/icons-react";

export default function AuthBtn() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant="secondary">
          Sign In <LogIn className="size-5 ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black">
        <DialogHeader>
          {/* <DialogTitle>Choose one and good to go.</DialogTitle> */}
          <DialogDescription className="flex h-full w-full items-center justify-center">
            <div className="flex items-center justify-between gap-5">
              <Button variant={"secondary"} onClick={() => signIn("twitter")}>
                <IconBrandTwitterFilled className="size-5 mr-2" /> Continue with
                Twitter
              </Button>
              OR
              <Button variant={"secondary"} onClick={() => signIn("google")}>
                <IconBrandGoogleFilled className="size-5 mr-2" /> Continue with
                Google
              </Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
