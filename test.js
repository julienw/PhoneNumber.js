/* -*- Mode: Java; tab-width: 2; indent-tabs-mode: nil; c-basic-offset: 2 -*- */
/* vim: set shiftwidth=2 tabstop=2 autoindent cindent expandtab: */

load("PhoneNumberMetaData.js");
load("PhoneNumber.js");

function IsViable(dial, expected) {
  var result = PhoneNumber.IsViable(dial);
  if (result != expected) {
    print("expected: " + expected);
    print("got: " + result);
  }
}

function Normalize(dial, expected) {
  var result = PhoneNumber.Normalize(dial);
  if (result != expected) {
    print("expected: " + expected);
    print("got: " + result);
  }
}

function CantParse(dial, currentRegion) {
  var result = PhoneNumber.Parse(dial, currentRegion);
  if (result) {
    print("expected: does not parse");
    print("got: " + dial + " " + currentRegion);
  }
}

function Parse(dial, currentRegion) {
  var result = PhoneNumber.Parse(dial, currentRegion);
  if (!result) {
    print("expected: parses");
    print("got: " + dial + " " + currentRegion);
  }
  return result;
}

function Test(dial, currentRegion, nationalNumber, region) {
  var result = Parse(dial, currentRegion);
  if (result.region != region || result.nationalNumber != nationalNumber) {
    print("expected: " + nationalNumber + " " + region);
    print("got: " + result.nationalNumber + " " + result.region);
  }
  return result;
}

function Format(dial, currentRegion, nationalNumber, region, nationalFormat, internationalFormat) {
  var result = Test(dial, currentRegion, nationalNumber, region);
  if (result.nationalFormat != nationalFormat ||
      result.internationalFormat != internationalFormat) {
    print("expected: " + nationalFormat + " " + internationalFormat);
    print("got: " + result.nationalFormat + " " + result.internationalFormat);
    return result;
  }
}

// Test whether could a string be a phone number.
IsViable(null, false);
IsViable("", false);
IsViable("1", false);
IsViable("*2", true); // Real number used in Venezuela
IsViable("*8", true); // Real number used in Venezuela
IsViable("12", true); // MIN_LENGTH_PHONE_NUMBER
IsViable("123", true); // MIN_LENGTH_PHONE_NUMBER
IsViable("1a2", false);
IsViable("12a", false);
IsViable("1234", true); // MIN_LENGTH_PHONE_NUMBER
IsViable("123a", true);
IsViable("+", false);
IsViable("+1", false);
IsViable("+12", false);
IsViable("+123", true);
IsViable("()123", true);
IsViable("(1)23", true);
IsViable("(12)3", true);
IsViable("(123)", true);
IsViable("(123)4", true);
IsViable("(123)4", true);
IsViable("123;ext=", false);
IsViable("123;ext=1", true);
IsViable("123;ext=1234567", true);
IsViable("123;ext=12345678", false);
IsViable("123 ext:1", true);
IsViable("123 ext:1#", true);
IsViable("123-1#", true);
IsViable("123 1#", true);
IsViable("123 12345#", true);
IsViable("123 +123456#", false);
// Test parsing national numbers.
Parse("033316005", "NZ");
Parse("03-331 6005", "NZ");
Parse("03 331 6005", "NZ");
// Testing international prefixes.
// Should strip country code.
Parse("0064 3 331 6005", "NZ");

// Test CA before US because CA has to import meta-information for US.
Parse("4031234567", "CA");
Parse("(416) 585-4319", "CA");
Parse("647-967-4357", "CA");
Parse("416-716-8768", "CA");
Parse("18002684646", "CA");
Parse("416-445-9119", "CA");
Parse("1-800-668-6866", "CA");
Parse("(416) 453-6486", "CA");
Parse("(647) 268-4778", "CA");
Parse("647-218-1313", "CA");
Parse("+1 647-209-4642", "CA");
Parse("416-559-0133", "CA");
Parse("+1 647-639-4118", "CA");
Parse("+12898803664", "CA");
Parse("780-901-4687", "CA");
Parse("+14167070550", "CA");
Parse("+1-647-522-6487", "CA");
Parse("(416) 877-0880", "CA");

// Try again, but this time we have an international number with region rode US. It should
// recognize the country code and parse accordingly.
Parse("01164 3 331 6005", "US");
Parse("+64 3 331 6005", "US");
Parse("64(0)64123456", "NZ");
// Check that using a "/" is fine in a phone number.
Parse("123/45678", "DE");
Parse("123-456-7890", "US");

// Test parsing international numbers.
Parse("+1 (650) 333-6000", "NZ");
Parse("1-650-333-6000", "US");
// Calling the US number from Singapore by using different service providers
// 1st test: calling using SingTel IDD service (IDD is 001)
Parse("0011-650-333-6000", "SG");
// 2nd test: calling using StarHub IDD service (IDD is 008)
Parse("0081-650-333-6000", "SG");
// 3rd test: calling using SingTel V019 service (IDD is 019)
Parse("0191-650-333-6000", "SG");
// Calling the US number from Poland
Parse("0~01-650-333-6000", "PL");
// Using "++" at the start.
Parse("++1 (650) 333-6000", "PL");
// Using a full-width plus sign.
Parse("\uFF0B1 (650) 333-6000", "SG");
// The whole number, including punctuation, is here represented in full-width form.
Parse("\uFF0B\uFF11\u3000\uFF08\uFF16\uFF15\uFF10\uFF09" +
      "\u3000\uFF13\uFF13\uFF13\uFF0D\uFF16\uFF10\uFF10\uFF10",
      "SG");

// Test parsing with leading zeros.
Parse("+39 02-36618 300", "NZ");
Parse("02-36618 300", "IT");
Parse("312 345 678", "IT");

// Test parsing numbers in Argentina.
Parse("+54 9 343 555 1212", "AR");
Parse("0343 15 555 1212", "AR");
Parse("+54 9 3715 65 4320", "AR");
Parse("03715 15 65 4320", "AR");
Parse("+54 11 3797 0000", "AR");
Parse("011 3797 0000", "AR");
Parse("+54 3715 65 4321", "AR");
Parse("03715 65 4321", "AR");
Parse("+54 23 1234 0000", "AR");
Parse("023 1234 0000", "AR");

// Test numbers in Mexico
Parse("+52 (449)978-0001", "MX");
Parse("01 (449)978-0001", "MX");
Parse("(449)978-0001", "MX");
Parse("+52 1 33 1234-5678", "MX");
Parse("044 (33) 1234-5678", "MX");
Parse("045 33 1234-5678", "MX");

// Test that lots of spaces are ok.
Parse("0 3   3 3 1   6 0 0 5", "NZ");

// Test omitting the current region. This is only valid when the number starts
// with a '+'.
Parse("+64 3 331 6005");
Parse("+64 3 331 6005", null);

// US numbers
Format("19497261234", "US", "9497261234", "US", "(949) 726-1234", "+1 949-726-1234");

// Try a couple german numbers from the US with various access codes.
Format("49451491934", "US", "451491934", "DE", "0451 491934", "+49 451 491934");
Format("+49451491934", "US", "451491934", "DE", "0451 491934", "+49 451 491934");
Format("01149451491934", "US", "451491934", "DE", "0451 491934", "+49 451 491934");

// Now try dialing the same number from within the German region.
Format("451491934", "DE", "451491934", "DE", "0451 491934", "+49 451 491934");
Format("0451491934", "DE", "451491934", "DE", "0451 491934", "+49 451 491934");

// Numbers in italy keep the leading 0 in the city code when dialing internationally.
Format("0577-555-555", "IT", "0577555555", "IT", "05 7755 5555", "+39 05 7755 5555");

// Telefonica tests
Format("612123123", "ES", "612123123", "ES", "612 12 31 23", "+34 612 12 31 23");

// Dialing 911 in the US. This is not a national number.
CantParse("911", "US");

// Test normalizing numbers. Only 0-9,#* are valid in a phone number.
Normalize("+ABC # * , 9 _ 1 _0", "+222#*,910");
Normalize("ABCDEFGHIJKLMNOPQRSTUVWXYZ", "22233344455566677778889999");
Normalize("abcdefghijklmnopqrstuvwxyz", "22233344455566677778889999");
