"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toastUpdate = exports.toastClose = exports.toastLoading = exports.toastError = exports.toastWarning = exports.toastInfo = exports.toastSuccess = void 0;
const react_toastify_1 = require("react-toastify");
react_toastify_1.toast.configure({
    autoClose: 10000,
    closeOnClick: true,
    draggable: true,
    pauseOnHover: true,
    closeButton: true
});
const toastSuccess = (msg, props = null) => {
    react_toastify_1.toast.success(msg, Object.assign({ autoClose: 1000 }, props));
};
exports.toastSuccess = toastSuccess;
const toastInfo = (msg, props = null) => {
    react_toastify_1.toast.info(msg, Object.assign({ autoClose: 3000 }, props));
};
exports.toastInfo = toastInfo;
const toastWarning = (msg, props = null) => {
    react_toastify_1.toast.warning(msg, Object.assign({ autoClose: 5000 }, props));
};
exports.toastWarning = toastWarning;
const toastError = (msg, props = null) => {
    react_toastify_1.toast.error(msg, Object.assign({}, props));
};
exports.toastError = toastError;
const toastLoading = () => {
    const toastID = react_toastify_1.toast.loading("Please wait...", {
        closeOnClick: true,
        draggable: true,
        closeButton: false
    });
    return toastID;
};
exports.toastLoading = toastLoading;
const toastClose = (toastID) => {
    react_toastify_1.toast.dismiss(toastID);
};
exports.toastClose = toastClose;
const toastUpdate = (toastID, msg, type) => {
    const toastProps = {
        type,
        delay: 100,
        autoClose: 10000,
        closeOnClick: true,
        draggable: true,
        pauseOnHover: true,
        closeButton: true,
        isLoading: false,
    };
    if (type === "success") {
        toastProps.autoClose = 1000;
    }
    if (type === "info") {
        toastProps.autoClose = 3000;
    }
    if (type === "warning") {
        toastProps.autoClose = 5000;
    }
    react_toastify_1.toast.update(toastID, Object.assign(Object.assign({}, toastProps), { render: msg }));
};
exports.toastUpdate = toastUpdate;
