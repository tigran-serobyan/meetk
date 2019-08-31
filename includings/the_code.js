function am_i(the_code, code) {
    return (the_code) ? (the_code.browser) ? the_code.browser == code.browser : true && (the_code.os) ? the_code.os == code.os : true && the_code.code == code.code : false;
}
