export default function validarCrearProducto(valores){
    let errores={}
    //Validar el nombre del usuario
    if(!valores.nombre){
        errores.nombre="El nombre es obligatorio";
    }
    if(!valores.empresa){
        errores.empresa="Nombre de la empresa es obligatorio";
    }

    if(!valores.url) {
        errores.url = 'La URL del producto es obligatoria';
    } else if( !/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url) ) {
        errores.url = "URL mal formateada o no válida"
    }

    //validar descripcion
    if(!valores.descripcion){
        errores.descripcion="Agrega una descripcion de tu producto"
    }

    return errores;
}