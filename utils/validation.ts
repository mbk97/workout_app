import Joi from "joi";

export const validate = (schema: Joi.ObjectSchema, data: any) => {
  const { error } = schema.validate(data, { abortEarly: false });
  if (error) {
    return error.details[0].message;
  }
  return null;
};

export const userRegistrationSchema = Joi.object({
  username: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Fullname is required",
    "string.min": "Fullname must be at least 3 characters long",
    "string.max": "Fullname cannot exceed 50 characters",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "string.empty": "Email is required",
  }),
  password: Joi.string()
    .min(8)
    .regex(/(?=.*[a-z])/, "lowercase")
    .regex(/(?=.*[A-Z])/, "uppercase")
    .regex(/(?=.*[0-9])/, "number")
    .regex(/(?=.*[!@#$%^&*(),.?":{}|<>])/, "special character")
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base":
        "Password must include at least one lowercase letter, one uppercase letter, one number, and one special character",
    }),
});

// Schema for user login validation
export const userLoginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please enter a valid email address",
    "string.empty": "Email is required",
  }),
  password: Joi.string()
    .min(8)
    .regex(/(?=.*[a-z])/, "lowercase")
    .regex(/(?=.*[A-Z])/, "uppercase")
    .regex(/(?=.*[0-9])/, "number")
    .regex(/(?=.*[!@#$%^&*(),.?":{}|<>])/, "special character")
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base":
        "Password must include at least one lowercase letter, one uppercase letter, one number, and one special character",
    }),
});

export const scheduleWorkoutValidationSchema = Joi.object({
  username: Joi.string().min(3).max(50).required().messages({
    "string.empty": "Username is required",
    "string.min": "Username must be at least 3 characters long",
    "string.max": "Username cannot exceed 50 characters",
  }),

  workoutId: Joi.number().required().messages({
    "number.base": "Workout ID must be a number",
    "any.required": "Workout ID is required",
  }),

  workoutDate: Joi.date().required().messages({
    "date.greater": "Workout date cannot be in the past",
    "any.required": "Workout date is required",
  }),

  workoutTime: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/) // 24-hour time format validation (HH:mm)
    .required()
    .messages({
      "string.empty": "Workout time is required",
      "string.pattern.base":
        "Workout time must be in HH:mm format (24-hour time)",
    }),
});
