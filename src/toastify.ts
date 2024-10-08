import { toast } from "react-toastify";

toast.configure({
    autoClose: 10_000,
    closeOnClick: true,
    draggable: true,
    pauseOnHover: true,
    closeButton: true
});

export const toastSuccess = (msg, props = null): void =>
{
    toast.success(msg, {
        autoClose: 1000,
        ...props
    })
}

export const toastInfo = (msg, props = null): void =>
{
    toast.info(msg, {
        autoClose: 3000,
        ...props
    })
}

export const toastWarning = (msg, props = null): void =>
{
    toast.warning(msg, {
        autoClose: 5000,
        ...props
    })
}

export const toastError = (msg, props = null): void =>
{
    toast.error(msg, { ...props })
}

export const toastLoading = (): any =>
{
    const toastID = toast.loading("Please wait...", {
        closeOnClick: true,
        draggable: true,
        closeButton: false
    })

    return toastID
}

export const toastClose = (toastID): void => {
    toast.dismiss(toastID)
}

export const toastUpdate = (toastID, msg, type): void =>
{
    const toastProps = {
        type,
        delay: 100,
        autoClose: 10_000,
        closeOnClick: true,
        draggable: true,
        pauseOnHover: true,
        closeButton: true,
        isLoading: false,
    }

    if (type === "success") {
        toastProps.autoClose = 1000
    }

    if (type === "info") {
        toastProps.autoClose = 3000
    }

    if (type === "warning") {
        toastProps.autoClose = 5000
    }

    toast.update(toastID, { ...toastProps, render: msg });
}
