import { isValidUserWalletAddress } from "utils";
import { object, string, number, array, boolean, date, ObjectSchema } from "yup";

const validate = async (schema: any, formData: any) => {
    return await schema.validate(formData)
        .then((value: any) => {
            return {
                status: true,
                errors: [],
                data: value
            }
        })
        .catch(function (err: any) {
            return {
                status: false,
                errors: err.errors,
                data: {}
            };
        });
}

export const validateAdminData = async (formData: any) => {
    const schema = object().shape({
        address: string().required('Walllet address must be required!')
            .test('wallet-address-validation', 'Invalid wallet address', function (value) {
                return isValidUserWalletAddress(value)
            }),
        passwordConfirmation: string()
            .test('passwords-match', 'Passwords must match', function (value) {
                return this.parent.password === value
            }),
        password: string().required('Password is required'),
        email: string().email("Invalid email!").required("Email must be required"),
        name: string().required("Name must be required"),
    })
    return await validate(schema, formData);
}


