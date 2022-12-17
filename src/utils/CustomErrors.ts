class CustomErrors extends Error {
    status: number;
    message: string;

    constructor(status: number, message: string) {
        super();
        this.status = status;
        this.message = message;
    }

    static unauthorized(message = "Unauthorized User", status = 401) {
        return new CustomErrors(status, message);
    }
    static badRequest(message = "Bad Request", status = 400) {
        return new CustomErrors(status, message);
    }
    static wentWrong(message = "Oops.. something went wrong", status = 500) {
        return new CustomErrors(status, message);
    }
}

export default CustomErrors;
