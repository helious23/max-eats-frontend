import { useForm } from "react-hook-form";

interface IForm {
  email: string;
  password: string;
}

export const LoggedOutRouter = () => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<IForm>();
  const onSubmit = () => {
    console.log(watch("email"));
  };
  const onInvalid = () => {
    console.log("cant log in");
  };

  return (
    <div>
      <h1>Logged Out</h1>
      <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <div>
          <input
            {...register("email", {
              required: "This is required",
              pattern:
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@gmail.com$/,
            })}
            className="border border-black"
            name="email"
            type="email"
            placeholder="e-mail"
          />
          {errors.email?.message && (
            <span className="font-bold text-red-600">
              {errors.email?.message}
            </span>
          )}
          {errors.email?.type === "pattern" && (
            <span className="font-bold text-red-600">Only gmail allowed</span>
          )}
        </div>
        <div>
          <input
            {...register("password", { required: "This is required" })}
            className="border border-blue-500"
            name="password"
            type="password"
            placeholder="password"
          />
        </div>
        <button className="bg-yellow-300 text-white">Submit</button>
      </form>
    </div>
  );
};
