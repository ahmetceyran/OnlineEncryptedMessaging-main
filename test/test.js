// var assert = require('assert')
import assert from 'assert'
import spn from '../spn.js'


describe('Şifreleme Fonksiyonları',function(){
    it('<ahmet> kelimesinin ikili sistemdeki karşılığını verir', function() {
        let sonuc = spn.string2Binary("ahmet");
        assert.equal("0110000101101000011011010110010101110100", sonuc);
    })
    it('İkili sistemdeki <ahmet> kelimesini string karşılığını verir', function() {
        let sonuc = spn.binary2String("0110000101101000011011010110010101110100");
        assert.equal("ahmet", sonuc);
    })
    it('<0110> ile <0011> ikili ifadelerinin xor işlemine tabi tutulması', function() {
        let sonuc = spn.xor("0110","0011");
        assert.equal("0101", sonuc);
    })
    it('<0123456789abcdef> ifadesinin karıştırlmış halini verir', function() {
        let sonuc = spn.sub("0123456789abcdef");
        assert.equal("28c590e4b1f63a7d", sonuc);
    })
    it('Karıştırılmış olan <0123456789abcdef> ifadesinin kendisini verir', function() {
        let sonuc = spn.rSub("28c590e4b1f63a7d");
        assert.equal("0123456789abcdef", sonuc);
    })
    it('<ulas> ifadesinin şifrelenmiş halini verir', function() {
        let sonuc = spn.encrypt("ulas");
        assert.equal("00001110011010111110111001010111", sonuc);
    })
    it('Şifrelenmiş olan <emir> ifadesinin orijinalini verir.', function() {
        let sonuc = spn.decrypt("00001110011010111110111001010111");
        assert.equal("ulas", sonuc);
    })
})
