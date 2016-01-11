/**
 * Created by Purva-PC on 10/24/2015.
 */
var stack_bottomright = {
    "dir1": "up",
    "dir2": "left",
    "firstpos1": 25,
    "firstpos2": 25
};

function doShowAlert(title,message) {

    new PNotify({
        title: title,
        text: message,
        opacity: .6,
        type:"success",
        delay: 2000,
        addclass: "stack-bottomright",
        stack: stack_bottomright
    });
}
function doShowAlertFailure(title,message) {

   new PNotify({
       title: title,
       text: message,
       opacity: .6,
       type:"error",
       delay:2000,
       addclass: "stack-bottomright",
       stack: stack_bottomright
   });


}
