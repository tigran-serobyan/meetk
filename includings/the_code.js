function am_i(the_code, code) {
    return the_code.browser == code.browser && the_code.os == code.os && the_code.code == code.code;
}