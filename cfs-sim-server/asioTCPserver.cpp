#include <iostream>
#include <string>
#include <boost/bind/bind.hpp>
#include <boost/shared_ptr.hpp>
#include <boost/enable_shared_from_this.hpp>
#include <boost/asio.hpp>

using boost::asio::ip::tcp;
using namespace std;
using namespace boost::asio;
using namespace boost::asio::chrono;


string make_daytime_string()
{
    string hi("Hello");
    return hi;
}

class tcp_connection : public boost::enable_shared_from_this<tcp_connection>
{
public:
    typedef boost::shared_ptr<tcp_connection> pointer;

    static pointer create(io_context& io)
    {
        return pointer(new tcp_connection(io));
    }

    tcp::socket& socket()
    {
        return socket_;
    }

    void start()
    {
        message_ = make_daytime_string();
        async_write( socket_, buffer(message_), boost::bind(&tcp_connection::handle_write, shared_from_this(), boost::asio::placeholders::error, boost::asio::placeholders::bytes_transferred) );
    }

private:
    tcp_connection(io_context& io) : socket_(io)
    {
    }

    void handle_write(const boost::system::error_code& error, size_t bytes_transferred)
    {
    }

    tcp::socket socket_;
    string message_;
};

class tcp_server
{
public:
    tcp_server(io_context& io_) : io(io_), acceptor_(io_, tcp::endpoint(tcp::v4(), 13))
    {
        start_accept();
    }

private:
    void start_accept()
    {
        tcp_connection::pointer new_connection = tcp_connection::create(io);

        acceptor_.async_accept(new_connection->socket(), boost::bind(&tcp_server::handle_accept, this, new_connection, boost::asio::placeholders::error));
    }

    void handle_accept(tcp_connection::pointer new_connection, const boost::system::error_code& error)
    {
        if (!error)
        {
            new_connection->start();
        }

        start_accept();
    }

    io_context& io;
    tcp::acceptor acceptor_;
};

int main()
{
    try
    {
        io_context io_;
        tcp_server server(io_);
        io_.run();
    }
    catch (exception& e)
    {
        cerr << e.what() << endl;
    }

    return 0;
}