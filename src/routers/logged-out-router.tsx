import { useForm } from "react-hook-form";

export const LoggedOutRouter = () => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = () => {
    console.log(watch("email"));
  };
  const onInvalid = () => {
    console.log(errors);
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
              pattern: {
                value:
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@gmail.com$/,
                message: "Email is invalid",
              },
            })}
            className="border border-black"
            name="email"
            type="email"
            placeholder="e-mail"
          />
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
