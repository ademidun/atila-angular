export class WebForm{
    attribute_type?: string;
    attribute_value?: string;
    question_key?: string;

    constructor(type, value, key){
        this.attribute_type = type;
        this.attribute_value = value;
        this.question_key = key
    }
}

export const WEBFORMS: WebForm[] = [
    {
        attribute_type : 'id',
        attribute_value: 'input_10_53',
        question_key: 'full_name'
    },
    {
        attribute_type : 'id',
        attribute_value: 'input_10_6',
        question_key: 'email_address'
    },
    {
        attribute_type : 'id',
        attribute_value: 'input_10_54',
        question_key: 'street_address'
    },
    {
        attribute_type : 'id',
        attribute_value: 'input_10_56',
        question_key: 'city'
    },
    {
        attribute_type : 'id',
        attribute_value: 'input_10_57',
        question_key: 'province'
    },
    {
        attribute_type : 'id',
        attribute_value: 'input_10_58',
        question_key: 'postal_code'
    },
    {
        attribute_type : 'id',
        attribute_value: 'input_10_52',
        question_key: 'immigration_essay'
    },
]

