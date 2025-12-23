import type { AxiosError } from 'axios'
import { toast } from 'sonner'

export default function ToastLogErrror(error: AxiosError | any) {
    if (error.response.data.errors === undefined) {
        return toast.error(error?.response?.data?.message)
    } else if (error.response.data.errors.length > 0) {
        return toast.error(error?.response?.data?.message, {
            description: (
                <>
                    {error?.response?.data?.errors?.map((item: { msg: string }, index: number) => (
                        <p key={index}>+ {item.msg}</p>
                    ))}
                </>
            ),
            duration: 5000,
        })
    } else {
        return toast.error(error?.response?.data?.message)
    }
}
