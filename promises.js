 const Promise1=new Promise((resolve,reject)=>{
    let success=true;
    if(success){
        resolve({
            username:"Zishan Ali",
            Location:"Italy"

        });
    }else{
        reject(new error("User not found"))
    }
});
const Promise2=new Promise((resolve,reject)=>{
    let success=true;
    if(success){
        resolve({
            ordernumder:"234"
            ,product:"dog"

        });
    }else{
        reject(new error("User not found"))
    }
});
