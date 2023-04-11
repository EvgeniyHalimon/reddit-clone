export class CustomError extends Error{
    status: number;
    constructor(obj: { message: string; status: number; }){
      super(obj.message);
      this.name = 'CustomError';
      this.status = obj.status;
    }
}