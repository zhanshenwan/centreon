package centreon::daemon::zmq;

use strict;
use warnings;
use ZMQ::LibZMQ3;
use ZMQ::Constants qw(:all);

sub recv_router($) {
    my $socket = shift;
    my %message;
    my $source = undef;
    my $inMessage = 0;
    my $str = "";

    while (1) {
        my $stream = zmq_recvmsg($socket);
        last if (!defined $stream);
        my $size = zmq_msg_size($stream);
        my $data = zmq_msg_data($stream);

        if (!defined $source) {
            $source = $data;
        } elsif ($inMessage != 0) {
            $inMessage = 1;
        } else {
            $str .= $data;
        }

        last if (not zmq_getsockopt($socket, ZMQ_RCVMORE));
    }
    $message{"source"} = $source;
    $message{"message"} = $str;

    return \%message;
}

1;
