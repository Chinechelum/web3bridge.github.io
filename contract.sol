pragma solidity >=0.4.16 <0.9.0;

contract nameApp {
    string name;

    function set(string myName) public {
        name = myName;
    }

    function get() public view returns (string) {
        return name;
    }
}
