package centreon::daemon::processus;

use strict;
use warnings;
use ZMQ::LibZMQ3;
use ZMQ::Constants qw(:all);
use centreon::common::logger;
use centreon::daemon::zmq;

use constant MAX_SIZE_BUF => 256;

my $logger;

BEGIN {
    $logger = centreon::common::logger->new();
}

sub runRouter() {
    my @connectedToDealer;
    my $context = zmq_init();
    my $socket = zmq_socket($context, ZMQ_ROUTER);
    zmq_setsockopt($socket, ZMQ_IDENTITY, "ROUTER");
    if (zmq_bind($socket, "ipc://router.ipc") != 0) {
        $logger->writeLogError("ROUTER::Error to initialize socket");
        $logger->writeLogDebug("ROUTER::" . $!);
        return;
    }

    $logger->writeLogInfo("ROUTER::Initialized");
    while (1) {
        my $message = centreon::daemon::zmq::recv_router($socket);
        print $message->{"message"} . "\n";

        ## Test redirect poller TEST1
        zmq_send($socket, "TEST1", -1, ZMQ_SNDMORE);
        zmq_send($socket, "", -1, ZMQ_SNDMORE);
        zmq_send($socket, "test", -1);
    }
}

sub runActionListener($) {
    my $port = shift;
    my $context = zmq_init();
    my $toRouter = zmq_socket($context, ZMQ_ROUTER);
    zmq_setsockopt($toRouter, ZMQ_IDENTITY, "ACTION_LISTENER");
    my $ret = zmq_connect($toRouter, "ipc://router.ipc");
    if ($ret != 0) {
        $logger->writeLogError("ACTION_LISTENER::Error to initialize socket");
        $logger->writeLogDebug("ACTION_LISTENER::" . $!);
        return;
    }

    my $listen = zmq_socket($context, ZMQ_REP);
    zmq_bind($listen, "tcp://*:$port");

    $logger->writeLogInfo("ACTION_LISTENER::Initialized");
    while (1) {
        my $buf;
        my $sizeBuf = zmq_recv($listen, $buf, MAX_SIZE_BUF);
        if ($sizeBuf > 0) {
            zmq_send($listen, "ASYNC");

            zmq_send($toRouter, "ROUTER", -1, ZMQ_SNDMORE);
            zmq_send($toRouter, "", -1, ZMQ_SNDMORE);
            zmq_send($toRouter, $buf, -1);
        }
    }
}

sub runPollerListener($) {
    my $port = shift;
    my $context = zmq_init();
    my $toRouter = zmq_socket($context, ZMQ_ROUTER);
    zmq_setsockopt($toRouter, ZMQ_IDENTITY, "POLLER_LISTENER");
    my $ret = zmq_connect($toRouter, "ipc://router.ipc");
    if ($ret != 0) {
        $logger->writeLogError("POLLER_LISTENER::Error to initialize socket");
        $logger->writeLogDebug("POLLER_LISTENER::" . $!);
        return;
    }

    my $listen = zmq_socket($context, ZMQ_REP);
    zmq_bind($listen, "tcp://*:$port");

    my @poll = (
        {
            socket => $toRouter,
            events => ZMQ_POLLIN,
            callback => sub {
                my $message = centreon::daemon::zmq::recv_router($toRouter);
            }
        },
        {
            socket => $listen,
            events => ZMQ_POLLIN,
            callback => sub {
                my $message = centreon::daemon::zmq::recv_router($listen);
                zmq_send($listen, "ASYNC", -1);

                zmq_send($toRouter, "ROUTER", -1, ZMQ_SNDMORE);
                zmq_send($toRouter, "", -1, ZMQ_SNDMORE);
                zmq_send($toRouter, $message->{"source"} . "\n", -1, ZMQ_SNDMORE);
                zmq_send($toRouter, "\n", -1, ZMQ_SNDMORE);
                zmq_send($toRouter, $message->{"message"}, -1);
            }
        }
    );

    $logger->writeLogInfo("POLLER_LISTENER::Initialized");
    while (1) {
        zmq_poll(\@poll);
    }
}

sub runConnectToPoller($$) {
    my $name = shift;
    my $url = shift;

    my $context = zmq_init();
    my $toRouter = zmq_socket($context, ZMQ_ROUTER);
    zmq_setsockopt($toRouter, ZMQ_IDENTITY, $name);
    my $ret = zmq_connect($toRouter, "ipc://router.ipc");
    if ($ret != 0) {
        $logger->writeLogError("${name}::Error to initialize socket");
        $logger->writeLogDebug("${name}::" . $!);
        return;
    }

    my $socket = zmq_socket($context, ZMQ_REQ);
    zmq_setsockopt($socket, ZMQ_RECONNECT_IVL, 5000);
    zmq_connect($socket, $url);

    my @poll = (
        {
            socket => $toRouter,
            events => ZMQ_POLLIN,
            callback => sub {
                my $message = centreon::daemon::zmq::recv_router($toRouter);
                
                zmq_send($socket, $message->{"message"}, -1);
            }
        },
        {
            socket => $socket,
            events => ZMQ_POLLIN,
            callback => sub {
                my $message = centreon::daemon::zmq::recv_router($socket);

                #zmq_send($toRouter, "ROUTER", -1, ZMQ_SNDMORE);
                #zmq_send($toRouter, "", -1, ZMQ_SNDMORE);
                #zmq_send($toRouter, $message->{"source"} . "\n", -1, ZMQ_SNDMORE);
                #zmq_send($toRouter, "\n", -1, ZMQ_SNDMORE);
                #zmq_send($toRouter, $message->{"message"}, -1);
            }
        }
    );

    $logger->writeLogInfo("${name}::Initialized");
    while (1) {
        zmq_poll(\@poll);
    }
}

sub runPoller($) {
    # Open socket for listen
    my $context = zmq_init();
    my $listen = zmq_socket($context, ZMQ_REP);
    zmq_bind($listen, "tcp://*:5557");

    while (1) {
        #my $message = centreon::daemon::zmq::recv_router($listen);
        my $buf;
        my $sizeBuf = zmq_recv($listen, $buf, MAX_SIZE_BUF);
        if ($sizeBuf > 0) {
            zmq_send($listen, "ASYNC");
            print "$buf\n";
        }
    }
}

1;
