import { Component } from '@angular/core';
import { HttpServiceGet} from "./get.service"

@Component({
    selector: 'my-app',
    template: `<div>
					<router-outlet></router-outlet>
			   </div>`,
    providers: [HttpServiceGet]
})
export class AppComponent {
    constructor( private httpGetServes: HttpServiceGet){}
    ngOnInit(){
        this.httpGetServes.getData()
            .subscribe(
                (data:number) => {
                    console.log(data);
                }
            );
    }

}

