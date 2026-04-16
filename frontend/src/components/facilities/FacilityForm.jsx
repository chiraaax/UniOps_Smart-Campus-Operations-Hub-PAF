import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FACILITY_TYPES, RESOURCE_STATUSES } from "../../utils/constants";

const nameLocationRegex = /^[A-Za-z0-9][A-Za-z0-9 .,'()/#-]*$/;
const getTodayDateString = () => {
  const now = new Date();
  const timezoneOffsetMs = now.getTimezoneOffset() * 60000;
  return new Date(now.getTime() - timezoneOffsetMs).toISOString().slice(0, 10);
};

const schema = yup
  .object({
    name: yup
      .string()
      .trim()
      .required("Name is required")
      .min(3, "Name must be at least 3 characters")
      .max(100, "Name cannot exceed 100 characters")
      .matches(nameLocationRegex, "Name contains invalid characters"),
    facilityType: yup
      .string()
      .required("Facility type is required")
      .oneOf(
        FACILITY_TYPES.map((item) => item.value),
        "Invalid facility type"
      ),
    capacity: yup
      .number()
      .transform((value, originalValue) =>
        String(originalValue).trim() === "" ? NaN : value
      )
      .typeError("Capacity is required")
      .required("Capacity is required")
      .integer("Capacity must be a whole number")
      .min(1, "Capacity must be at least 1")
      .max(10000, "Capacity cannot exceed 10000"),
    location: yup
      .string()
      .trim()
      .required("Location is required")
      .min(3, "Location must be at least 3 characters")
      .max(120, "Location cannot exceed 120 characters")
      .matches(nameLocationRegex, "Location contains invalid characters"),
    description: yup
      .string()
      .transform((value) => (value ?? "").trim())
      .max(1000, "Description cannot exceed 1000 characters"),
    availabilityStart: yup
      .string()
      .required("Availability start is required")
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, "Must be HH:MM"),
    availabilityEnd: yup
      .string()
      .required("Availability end is required")
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, "Must be HH:MM"),
    bookingDate: yup
      .string()
      .required("Booking date is required")
      .matches(/^\d{4}-\d{2}-\d{2}$/, "Booking date is invalid"),
    status: yup
      .string()
      .required("Status is required")
      .oneOf(
        RESOURCE_STATUSES.map((item) => item.value),
        "Invalid status"
      ),
  })
  .test(
    "availability-window",
    "Availability end time must be after start time",
    function (values) {
      if (!values?.availabilityStart || !values?.availabilityEnd) {
        return true;
      }
      if (values.availabilityEnd > values.availabilityStart) {
        return true;
      }

      return this.createError({
        path: "availabilityEnd",
        message: "Availability end time must be after start time",
      });
    }
  );

function FacilityForm({ defaultValues, onSubmit, isLoading, isEditMode }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: defaultValues?.name || "",
      facilityType: defaultValues?.facilityType || "",
      capacity: defaultValues?.capacity || "",
      location: defaultValues?.location || "",
      description: defaultValues?.description || "",
      availabilityStart: defaultValues?.availabilityStart?.slice(0, 5) || "",
      availabilityEnd: defaultValues?.availabilityEnd?.slice(0, 5) || "",
      bookingDate: defaultValues?.bookingDate || getTodayDateString(),
      status: defaultValues?.status || "ACTIVE",
    },
  });

  const availabilityStart = watch("availabilityStart");
  const availabilityEnd = watch("availabilityEnd");

  const handleFormSubmit = (values) => {
    onSubmit({
      ...values,
      name: values.name.trim(),
      location: values.location.trim(),
      description: values.description?.trim() || "",
      capacity: Number(values.capacity),
      availabilityStart: `${values.availabilityStart}:00`,
      availabilityEnd: `${values.availabilityEnd}:00`,
      bookingDate: values.bookingDate,
    });
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="card w-full max-w-2xl mx-auto space-y-4"
    >
      <div>
        <label className="label">Name</label>
        <input className="input-field" type="text" {...register("name")} />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="label">Facility Type</label>
        <select className="input-field" {...register("facilityType")}>
          <option value="">Select type</option>
          {FACILITY_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        {errors.facilityType && (
          <p className="text-red-500 text-xs mt-1">
            {errors.facilityType.message}
          </p>
        )}
      </div>

      <div>
        <label className="label">Capacity</label>
        <input
          className="input-field"
          type="number"
          min="1"
          {...register("capacity")}
        />
        {errors.capacity && (
          <p className="text-red-500 text-xs mt-1">{errors.capacity.message}</p>
        )}
      </div>

      <div>
        <label className="label">Location</label>
        <input className="input-field" type="text" {...register("location")} />
        {errors.location && (
          <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>
        )}
      </div>

      <div>
        <label className="label">Description</label>
        <textarea
          className="input-field"
          rows="4"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-red-500 text-xs mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="label">Availability Start</label>
          <input
            className="input-field"
            type="time"
            max={availabilityEnd || undefined}
            {...register("availabilityStart")}
          />
          {errors.availabilityStart && (
            <p className="text-red-500 text-xs mt-1">
              {errors.availabilityStart.message}
            </p>
          )}
        </div>
        <div>
          <label className="label">Availability End</label>
          <input
            className="input-field"
            type="time"
            min={availabilityStart || undefined}
            {...register("availabilityEnd")}
          />
          {errors.availabilityEnd && (
            <p className="text-red-500 text-xs mt-1">
              {errors.availabilityEnd.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="label">Booking Date</label>
        <input
          className="input-field"
          type="date"
          {...register("bookingDate")}
        />
        {errors.bookingDate && (
          <p className="text-red-500 text-xs mt-1">
            {errors.bookingDate.message}
          </p>
        )}
      </div>

      <div>
        <label className="label">Status</label>
        <select className="input-field" {...register("status")}>
          {RESOURCE_STATUSES.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
        {errors.status && (
          <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="btn-primary w-full flex items-center justify-center gap-2"
        disabled={isLoading}
      >
        {isLoading && (
          <span className="h-4 w-4 rounded-full border-2 border-white/70 border-t-transparent animate-spin" />
        )}
        {isLoading
          ? isEditMode
            ? "Updating..."
            : "Creating..."
          : isEditMode
          ? "Update Facility"
          : "Create Facility"}
      </button>
    </form>
  );
}

export default FacilityForm;
