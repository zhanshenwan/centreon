package centreon::daemon::crypt;

use strict;
use warnings;
use Crypt::OpenSSL::Random;
use Crypt::OpenSSL::RSA;

sub generateKeys($$$) {
    my $path = shift;
    my $name = shift;
    my $passwd = shift;

    Crypt::OpenSSL::Random::random_seed($passwd);
    Crypt::OpenSSL::RSA->import_random_seed();

    my $rsa = Crypt::OpenSSL::RSA->generate_key(1024);
    print $rsa->get_public_key_x509_string();
}

sub getSymetricKey() {
}

1;
