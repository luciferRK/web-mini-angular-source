import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  title= "Mini-Project";

  linktogo:String;
  

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  changeLink(){
    this.router.navigateByUrl('/'+this.linktogo);
  }

}
