import {HttpException, HttpStatus} from '@nestjs/common';

export class ValidationException extends HttpException {
    messages;

    constructor(response) {
        const newResponse = {
            type: 'validation',
            errors: response,
        };
        super(newResponse, HttpStatus.BAD_REQUEST);
        this.messages = newResponse;
    }
}
