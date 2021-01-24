import { TextService } from './text.service';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Text } from '@angular/compiler/src/render3/r3_ast';
import * as crypt from 'crypto-js';
import { trigger,state,style,animate,transition} from "@angular/animations";

@Component({
  selector: 'app-text',
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({transform: 'scale(0.5,0.5)', opacity: 0}),
          animate('0.2s', style({transform: 'scale(1,1)', opacity: 1}))
        ]),
        transition(':leave', [
          style({transform: 'scale(1,1)', opacity: 1}),
          animate('0.2s', style({transform: 'scale(0.5,0.5)', opacity: 0}))
        ])
      ]
    ),
    trigger(
      'enterAnimationPassword', [
        transition(':leave', [
          style({transform: 'scale(1,1)', opacity: 1}),
          animate('0.2s', style({transform: 'scale(0.5,0.5)', opacity: 0}))
        ])
      ]
    )
  ],
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.css']
})
export class TextComponent implements OnInit,AfterViewInit {

  link = {
    _id:''
  }

  linkPresent:Boolean;
  linkPresentPass:Boolean;
  pass:String;
  cpass:String;
  cpassc:String;
  content:String;
  saveStatus:String = "Save";
  noMatchPassword:Boolean=false;
  wrongPassword:Boolean=false;
  fontSize:String;

  dataBaseText:String;

  createLinkBool:Boolean = false;

  space = {
    _id:'',
    password:'',
    text:''
  }

  constructor(private textservice:TextService,private router:Router) { 
    this.space._id=this.link._id = router.url.toString().substring(1);
    this.check(this.link);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void{
  }

  check(site){
    this.textservice.checkAvailable(site).
    subscribe(
      res=>{
        this.linkPresentPass=this.linkPresent=res["found"];
      }
    );
  }

  renderPage(){
    this.textservice.getContent(this.space)
    .subscribe(
      res=>{
        if(res["status"]){
          this.space._id = res["content"]["_id"];
          this.space.password = res["content"]["password"];
          this.content = crypt.AES.decrypt(res["content"]["text"],this.pass).toString(crypt.enc.Utf8);
          this.space.text = res["content"]["text"];
          this.saveStatus="Saved";
        }
        else{
          console.log("False");
        }
      }
    )
  }

  update(){
    if(this.linkPresent==false){
      this.createLinkBool = true;
    }
    else{
      this.space.text=crypt.AES.encrypt(this.content,this.pass).toString();
      this.textservice.updateContent(this.space)
      .subscribe(
        res=>{
          this.saveStatus="Saved";
        }
      );
    }
  }

  checkAuth(){
    this.space.password = crypt.SHA1(this.pass).toString();
    this.textservice.checkAuth(this.space)
    .subscribe(
      res=>{
        if(res['status']==true){
          this.linkPresentPass=false;
          this.renderPage();
        }
        else{
          this.pass="";
          this.wrongPassword=true;
        }
      }
    );
  }

  newOne(){
    if(this.space.text == this.dataBaseText){
      this.update();
    }
    this.router.navigateByUrl('');
  }

  createLink(){
    this.space._id=this.link._id;
    if(this.cpass==this.cpassc){
      this.space.password = crypt.SHA1(this.cpass).toString();
      this.space.text = crypt.AES.encrypt(this.content,this.cpass).toString();
      this.textservice.createUser(this.space)
      .subscribe(
        res=>{
          this.saveStatus="Saved";
          this.createLinkBool=false;
        }
      );
    }
    else{
      this.noMatchPassword = true;
      return;
    }
  }

  closeCreate(){
    this.createLinkBool=false;
  }

  checkValues(){
    if(this.space.text!=this.content){
      this.saveStatus="Save";
    }
    else{
      this.saveStatus="Saved";
    }
  }
  

}
