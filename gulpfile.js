let pruject_folder="dist";
let sourse_folder="src";


let path={
    build:{
        html:pruject_folder+"/",
        css:pruject_folder+"/css/",
        js:pruject_folder+"/js/",
        img:pruject_folder+"/img/",
        fonts:pruject_folder+"/fonts/",
    },
    src:{
        html:pruject_folder+"/",
        css:pruject_folder+"/scss/style.scss",
        js:pruject_folder+"/js/script.js",
        img:pruject_folder+"/img/**/*.[jpg, png, svg, ico]",
        fonts:pruject_folder+"/fonts/*.ttf",
    },
    watch:{
        html:pruject_folder+"/**/*.html",
        css:pruject_folder+"/scss/**/*.scss",
        js:pruject_folder+"/js/**/*.js",
        img:pruject_folder+"/img/**/*.[jpg, png, svg, ico]",
    
    },
    clean:"./" + pruject_folder + "/"

    
}

let {src, dest} = reguire("gulp"),
gulp= reguire("gulp"),
