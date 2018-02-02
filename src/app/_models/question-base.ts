export class QuestionBase<T>{
  // todo Helper to  autofill labels as pretiffied keys
    //TODO how is controlType different from type? Is having both redundant?
    value?: T;
    key: string;
    label: string;
    link?: string;
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
        link?: string,
      } = {}) {
      this.value = options.value;
      this.key = options.key || '';
      this.label = options.label || '';
      this.link = options.link || '';
      this.required = !!options.required;
      this.order = options.order || 100 ;
      this.controlType = options.controlType || '';
      this.class_data = options.class_data || '';
    }
  }
