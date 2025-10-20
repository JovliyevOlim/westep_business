import PhoneInput from "react-phone-number-input/min";
import {FormikProps} from "formik";


interface IPhoneNumberInputProps<T> {
    label?: string;
    name: keyof T;
    formik: FormikProps<T>,
    className: string
}

const PhoneNumberInput = <T extends Record<string, any>>({
                              label = "",
                              name,
                              formik,
                              className = "",
                          }: IPhoneNumberInputProps<T>) => {


    return (
        <div className={`${className} form-group mb-2`}>
            {label && (
                <label htmlFor={name as string} className="form-label fw-medium">
                    {label}
                </label>
            )}
            <PhoneInput
                defaultCountry="UZ"
                value={formik.values[name] as string}
                onChange={(e) => {
                    formik.setFieldValue(name as string, e)
                }}
                international
                countryCallingCodeEditable={false}
            />
            {formik.errors[name] && formik.touched[name] ? (
                <p className={'text-start text-danger ms-3'}>{formik.errors[name] as string}</p>
            ) : null}
        </div>
    );
};

export default PhoneNumberInput;