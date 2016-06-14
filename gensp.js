console.log('gensp.js loaded');

// Breeding a genomespace client object
// Special thanks to Ted Liefeld from the Broad Institute
// for having enabled this approach and providing
// CORS test with mathbiol.github.io/genomespace/corstest.html

gensp={}

gensp.getDiv=function(){
	if(document.getElementById('genspDiv')){
		gensp.div=document.getElementById('genspDiv')
	}else{
		gensp.div=document.body
	}
}

gensp.login=function(fun){ // Ted, let's see if I got it right
    // check if user is logged in
    // 1. config ajax call
    $.ajaxSetup({ // pasted straight from Ted's
		xhrFields: {
            withCredentials: true
        },
        mozBackgroundRequest: true,
        crossDomain: true
	});
	// check for user credentials
	$.getJSON('https://gsui.genomespace.org/jsui/gslogin')
	//$.getJSON('login.json')
	 .then(function(x){
	 	gensp.connection=x;
	 	console.log('logged in as '+gensp.connection.gsusername+' as '+new Date())
		if(gensp.connection.gsusername!=="null"){ // connected	
			if(fun){fun()} // callback
		}else{ // not connected yet
			var div = document.createElement('div')
			div.style.color='navy'
			div.id="loginGenspDiv"
			div.innerHTML='<p>Login below into GenomeSpace and then <button style="color:green" id="loginGenspDivContinue">Continue</button></p>'
			gensp.getDiv() // locate gensp.div
			gensp.div.appendChild(div)
			// use iframe to connect
			ifr = document.createElement('iframe')
			ifr.width="450px"
			ifr.height="250px"
			ifr.src = "https://gsui.genomespace.org/identityServer/openIdProvider?openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.return_to=https%3A%2F%2Fgsui.genomespace.org%2Fjsui%2FopenIdClient%3Fis_return%3Dtrue&openid.realm=https%3A%2F%2Fgsui.genomespace.org%2Fjsui%2FopenIdClient%3Fis_return%3Dtrue&openid.mode=checkid_setup"
			div.appendChild(ifr)
			loginGenspDivContinue.onclick=function(){
				loginGenspDiv.parentElement.removeChild(loginGenspDiv)
				setTimeout(function(){gensp.login(fun)},1000)
			}
		}
		
	 })

}

gensp.login2=function(){ // login with promises
	return new Promise(function(fun){
		gensp.login(fun)
	},function(){
		console.log('rejected for some reason')
	})
}



// ini

gensp.ini=function(){
	gensp.login(function(){
		console.log('done logging in')
	})
}

if(typeof(jQuery)=="undefined"){
	var s = document.createElement('script')
	s.src="https://code.jquery.com/jquery-3.0.0.min.js"
	s.onload=function(){
		$(gensp.ini)
	}
	document.head.appendChild(s)
}else{
	$(gensp.ini)
}


