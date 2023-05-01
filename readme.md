# APIs for handling backend services

/auth/signup    POST
    request = {name, email, password}
    response = {msg}

/auth/login     POST
    request = {email, password}
    response = {msg, token}

/profile        GET
    request = {login token}
    response = {user}

/profile/update PATCH
    request = {login token, payload}
    response = {updated user data}

/pg             GET
    request = {login token}
    response = {pg}

/pg/add         POST
    request = {login token, payload}
    response = {msg}

/venders        GET
    request = {login token}
    response = {venders}

/venders/add    POST
    request = {login token admin, payload}
    response = {msg}

/cart/:venderId     GET
    request = {login token}
    response = {cart}

/cart/add           POST
    request = {login token, payload}
    response = {msg}

/cart/delete/:cart_id   DELETE
    request = {login token}
    response = {msg}

/orders         GET
    request = {login token}
    response = {orders}

/orders/add     POST
    request = {login token, payload}
    response = {msg}

/tiffins/:vender_id     GET
    request = {login token}
    response = {tiffins}

/tiffins/add    POST
    request = {login token vender, payload}
    response = {msg}