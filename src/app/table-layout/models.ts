// ./project-center/model.ts
//https://medium.com/@ct7/building-a-reusable-table-layout-for-your-angular-2-project-adf6bba3b498
export class Project { 
    id: number;
    name: string;
    cost?: number;
    total_cost?: number;
    first_flight?: string;
    launch?: string;
    status: string;
}
export class Person {
    id: number;
    name: string;
    year_joined: number;
    job: string;
    missions: string[];
    crewWith?: { 
        id: number,
        name: string
    }[];
    manager?: any;
}

export class ColumnSetting {
    primaryKey: string;
    header?: string;
    format?: string;
    alternativeKeys?: string[];
}

/**
 * ColumnMap class: Constructs configuration settings for each column.
 *  Supplies the appropriate parameters to the TableLayoutComponent, 
 * FormatCellPipe, and StyleCellDirective for each column.
 *  Constructs class instances initialized with default values,
 *  if user settings are not supplied.
 */
export class ColumnMap {
    primaryKey: string;
    public _header: string;
    public _format: string;
    alternativeKeys?: string[];

    constructor ( settings ) {
            this.primaryKey = settings.primaryKey;
            this.header = settings.header;
            this.format = settings.format;
            this.alternativeKeys = settings.alternativeKeys;
    }
    set header(setting: string) {
        this._header = setting ? 
            setting :
            this.primaryKey.slice(0, 1).toUpperCase() + 
                this.primaryKey.replace(/_/g, ' ' ).slice(1)
    }
    get header() {
        return this._header;
    }
    set format(setting: string) {
        this._format = setting ? setting : 'default';
    }
    get format() {
        return this._format;
    }
    /**
     * For each class instance that can be used to look for the column value on several object properties if alternativeKeys are provided in the settings. This handles the case, for example — 
    My Cost column value could be stored as object.cost, object.total_cost, or object.funding.
     */
    access = function ( object: any ) {
            if (object[this.primaryKey] || !this.alternativeKeys) {
                return this.primaryKey;
            }
            for (let key of this.alternativeKeys) { 
                if (object[key]) {
                    return key;
                }
            }
            return this.primaryKey;
        }
}
