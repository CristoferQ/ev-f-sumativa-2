import { Component , OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  formulario1 = new FormGroup({
    nombre: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])),
    codigo: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])),
    precio: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])),
    descripcion: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)]))
  })
  formulario2 = new FormGroup({
    nombre: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])),
    codigo: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])),
    precio: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])),
    descripcion: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)]))
  })
  
  productos: Producto[] = []
  compras: Producto[] = []
  actual_codigo: string = "";
  constructor() { }
  ngOnInit(): void {
    //localStorage.clear();
    this.listar();
    this.listarCompras();
  }

  listar(){
    let keys = Object.keys(localStorage);
    console.log(keys)
    for (let i of keys){
      if (i != "compras"){
        if (this.formulario1.value.codigo != JSON.parse(localStorage.getItem(i)!).codigo || this.formulario1.value.codigo == "" && JSON.parse(localStorage.getItem(i)!).codigo != "compras"){
          this.productos.push(new Producto(JSON.parse(localStorage.getItem(i)!).nombre, JSON.parse(localStorage.getItem(i)!).codigo, JSON.parse(localStorage.getItem(i)!).precio, JSON.parse(localStorage.getItem(i)!).descripcion));
          }
        }
      }
  }
  listarCompras(){
    let keys = Object.keys(localStorage);
    for (let i of keys){
      if (i == "compras"){
        this.compras.push(new Producto(JSON.parse(localStorage.getItem(i)!).nombre, JSON.parse(localStorage.getItem(i)!).codigo, JSON.parse(localStorage.getItem(i)!).precio, JSON.parse(localStorage.getItem(i)!).descripcion));
        }
      }
  }
  
  
  agregar(){
    let obj = this.productos.find(o => o.codigo === this.formulario1.value.codigo);
    if(obj == null){
      this.productos.push(new Producto(this.formulario1.value.nombre, this.formulario1.value.codigo, this.formulario1.value.precio, this.formulario1.value.descripcion));
      let obj = this.productos.find(o => o.codigo === this.formulario1.value.codigo);
      localStorage.setItem(this.formulario1.value.codigo, JSON.stringify(obj));
      this.formulario1.controls['nombre'].setValue("");
      this.formulario1.controls['codigo'].setValue("");
      this.formulario1.controls['precio'].setValue("");
      this.formulario1.controls['descripcion'].setValue("");
    }else{
      console.log("error")
    }
    
  }
  eliminar(codigo:string){      
    this.productos = this.productos.filter(i => i.codigo != codigo);
    localStorage.removeItem(codigo);
  }

  editar(codigo:string){
    this.actual_codigo = codigo;
    let obj = this.productos.find(o => o.codigo === codigo);
    if (obj != null){
      this.formulario2.controls['nombre'].setValue(obj.nombre);
      this.formulario2.controls['codigo'].setValue(obj.codigo);
      this.formulario2.controls['precio'].setValue(obj.precio);
      this.formulario2.controls['descripcion'].setValue(obj.descripcion);
    }
  }
  onSubmit() {
    if (this.formulario2.valid) {
      let objIndex = this.productos.findIndex((obj => obj.codigo == this.actual_codigo));
      
      this.productos[objIndex].nombre = this.formulario2.value.nombre;
      this.productos[objIndex].codigo = this.formulario2.value.codigo;
      this.productos[objIndex].precio = this.formulario2.value.precio;
      this.productos[objIndex].descripcion = this.formulario2.value.descripcion;
      
      var json_object = JSON.parse(localStorage[this.actual_codigo]);
      json_object.nombre = this.formulario2.value.nombre; 
      json_object.codigo = this.formulario2.value.codigo; 
      json_object.precio = this.formulario2.value.precio; 
      json_object.descripcion = this.formulario2.value.descripcion; 
      localStorage[this.actual_codigo] = JSON.stringify(json_object);
    }
  }
  comprar(codigo:string){
    let obj = this.productos.find(o => o.codigo === codigo);
    if(obj != null){
      this.productos = this.productos.filter(i => i.codigo != codigo);
      localStorage.removeItem(codigo);
      this.compras.push(new Producto(obj.nombre, obj.codigo, obj.precio, obj.descripcion));
      localStorage.setItem("compras", JSON.stringify(obj));
    }
  }

}
class Producto{
  constructor(public nombre:string, public codigo:string, public precio:number, public descripcion:string){}
}