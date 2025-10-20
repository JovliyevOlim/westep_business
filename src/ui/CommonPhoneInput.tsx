import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

function CommonPhoneInput({formik}: { formik: any }) {
    return (
        <>
            <PhoneInput
                defaultCountry="UZ"
                value={formik.values.phone}
                onChange={(e) => {
                    formik.setFieldValue("phone", e)
                }}
                international
                countryCallingCodeEditable={false}
                onBlur={formik.handleBlur}
            />
            {formik.errors.phone && formik.touched.phone ? (
                <p className={'text-start text-danger'}>{formik.errors.phone}</p>
            ) : null}
        </>
    );
}

export default CommonPhoneInput;