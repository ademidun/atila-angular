export class QuestionBase<T>{
    //TODO how is controlType different from type? Is having both redundant?
    value?: T;
    key: string;
    label: string;
    required: boolean;
    order: number;
    controlType: string;
    class_data: string;

    constructor(options: {
        value?: T,
        key?: string,
        label?: string,
        required?: boolean,
        order?: number,
        controlType?: string,
        class_data?: string,
      } = {}) {
      this.value = options.value;
      this.key = options.key || '';
      this.label = options.label || '';
      this.required = !!options.required;
      this.order = options.order || 100 ;
      this.controlType = options.controlType || '';
      this.class_data = options.class_data || '';
    }
  }
