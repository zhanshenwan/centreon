package centreon::daemon::events;
use strict;
use warnings;
use Exporter;

our @ISA = qw(Exporter);
our @EXPORT = qw(&on &emit);

our %events;

sub on {
    my ($name, $callback) = @_;
    push(@{$events{$name}}, $callback);
}

sub emit {
    my $name = shift;
    my @args = @_;
    foreach (@{$events{$name}}) {
        $_->(@args);
    }
}

1;
