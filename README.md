# Wrapper for JAM

JAM is a web UI for JoinMarket with focus on user-friendliness. It aims to provide sensible defaults and be easy to use for beginners while still providing the features advanced users expect.

## Dependencies

- [docker](https://docs.docker.com/get-docker)
- [docker-buildx](https://docs.docker.com/buildx/working-with-buildx/)
- [yq](https://mikefarah.gitbook.io/yq)
- [deno](https://deno.land/)
- [start-sdk](https://github.com/Start9Labs/start-os/tree/master/backend)
- [make](https://www.gnu.org/software/make/)

## Build enviroment

Prepare your StartOS build enviroment. In this example we are using Ubuntu 20.04.

1. Install docker

```
curl -fsSL https://get.docker.com -o- | bash
sudo usermod -aG docker "$USER"
exec sudo su -l $USER
```

2. Set buildx as the default builder

```
docker buildx install
docker buildx create --use
```

3. Enable cross-arch emulated builds in docker

```
docker run --privileged --rm linuxkit/binfmt:v0.8
```

4. Install yq

```
sudo snap install yq
```

5. Install essentials build packages

```
sudo apt-get install -y build-essential openssl libssl-dev libc6-dev clang libclang-dev ca-certificates
```

6. Install Rust

```
curl https://sh.rustup.rs -sSf | sh
# Choose nr 1 (default install)
source $HOME/.cargo/env
```

7. Install toml

```
cargo install toml-cli
```

8. Build and install start-sdk

```
cd ~/ && git clone https://github.com/Start9Labs/start-os.git
cd start-os/backend/
./install-sdk.sh
```

## Cloning

Clone the project locally. Note the submodule link to the original project(s).

```
git clone https://github.com/Start9Labs/jam-wrapper.git
cd jam-wrapper
git submodule update --init --recursive
```

## Building

To build the project, run the following commands:

```
docker run --rm --privileged multiarch/qemu-user-static --reset -p yes
docker buildx create --name multiarch --driver docker-container --use
docker buildx inspect --bootstrap
```

You should only run the above commands once to create a custom builder. Afterwards you will only need the below command to make the .s9pk file

```
make
```

## Installing (on Embassy)

Sideload from the web-UI via:
System > Sideload Service

SSH into an StartOS device.
`scp` the `.s9pk` to any directory from your local machine.
Run the following command to install the package:

```
start-cli auth login
#Enter your StartOS server's master password, then run:
start-cli package install /path/to/jam.s9pk
```

## Verify Install

Go to your StartOS Services page, select JAM and start the service.

#Done
