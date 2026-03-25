const str = "Ekmeğini, insanlarla paylaşacaksın.";
console.log("Original:", str);
const buffered = Buffer.from(str, 'latin1').toString('utf8');
console.log("Buffered latin1->utf8:", buffered);

// What if the original string was correctly UTF-8 decoded, but then we cast it to latin1?
// Let's see if that produces "Ekmeini, insanlarla payla_acaks1n"
