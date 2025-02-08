import { Role } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { createNewUser } from "@/app/actions/users";
import { useUserStore } from "@/store/userStore";
import { TUserWithRelations } from "@/types/users";
import { setSession } from "@/utils/auth";
import { getISODateGMTminus5 } from "@/utils/funcs";

interface SignUpForm {
  idType: string;
  idNumber: string;
  fullName?: string;
  email: string;
  gender?: string;
  city: string;
  birthday?: string;
  phone?: string;
  password: string;
  confirmPassword?: string;
}

export const useSignUpForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const router = useRouter();

  const { setUser } = useUserStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpForm>({
    defaultValues: {
      idType: "CC",
      idNumber: "",
      fullName: "",
      email: "",
      city: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignUpForm) => {
    setIsLoading(true);
    if (data.password !== data.confirmPassword) {
      setError("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }
    const [name, lastName] = data.fullName!.split(" ");
    delete data.fullName;
    delete data.confirmPassword;
    const createdUser = await createNewUser({
      ...data,
      name,
      lastName,
      collectiveId: "RAVERS",
      createdAt: getISODateGMTminus5(new Date()),
      updatedAt: getISODateGMTminus5(new Date()),
      role: Role.RAVER,
    });
    if (createdUser) {
      setUser(createdUser as TUserWithRelations);
      setTimeout(async () => {
        setSuccess(true);
        await setSession(createdUser as TUserWithRelations);
        reset();
        setIsLoading(false);
        router.push("/events");
      }, 3000);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    success,
    isLoading,
    error,
  };
};
