{ pkgs }: {
  deps = [
    pkgs.nodejs-20_x,
    pkgs.yarn,
    pkgs.stripe-cli
  ];
}
