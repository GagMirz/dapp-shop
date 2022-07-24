//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Shop is ERC721Enumerable {
    using SafeMath for uint256;

    struct Fruit {
        uint256 id;
        string fruitType;
        string uri;
        uint256 amount;
        uint256 price;
    }

    mapping (uint256 => uint256) public tokenIdtoFruit;

    address owner;

    Fruit[] public fruits;
    uint256 private fruitCounter = 0;

    modifier onlyOwner {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    /// @dev Constructor of a shop.
    /// @param _owner - contract owner's address.
    constructor(address _owner) ERC721("FruitShop", "FRT"){
        require(_owner != address(0), "Owner can't be a null address");
        owner = _owner;
    }

    /// @dev Minting an item of a shop.
    /// @param _to - item owner's address.
    /// @return _tokenId - item id.
    function mint(address _to) private returns(uint256) {
        uint256 _tokenId = totalSupply().add(1);
        _mint(_to, _tokenId);
        return _tokenId;     
    }

    /// @dev adding an item of a shop.
    /// @param _fruitType - type of item in bytes32
    /// @param _uri - item owner's address.
    /// @param _amount - item owner's address.
    /// @param _price - item owner's address.
    function addFruit(string memory _fruitType, string memory _uri, uint256 _amount, uint256 _price) external onlyOwner {
        require(bytes(_fruitType).length  > 0, "Fruit can't be without type");
        require(bytes(_uri).length > 0, "Fruit image uri can't be empty");
        require(_amount > 0, "Fruit can't be initated with empty stock");
        require(_price > 0, "Fruit price can't be zero");

        Fruit memory fruit = Fruit(fruitCounter, _fruitType, _uri, _amount, _price);
        fruits.push(fruit);
        fruitCounter += 1;
    }
 
    /// @dev buying an item of a shop.
    /// @param _id - id of item
    /// @param _amount - amount of item to buy
    function buyFruit(uint256 _id, uint256 _amount) external payable {
        Fruit memory fruit = fruits[_id];

        uint256 priceTotal = fruit.price * _amount;

        require(_amount > 0, "Need to specify positive amount");
        require(bytes(fruit.fruitType).length  > 0, "Minting non existense fruit");
        require(fruit.amount - _amount> 0, "Fruit is out of stock");
        require(priceTotal <= msg.value, "Amount of ether is less than required");
        
        for(uint256 i = 0; i < _amount; ++i){
            uint256 _tokenId = mint(msg.sender);

            fruit.amount -= 1;
            fruits[_id] = fruit;

            tokenIdtoFruit[_tokenId] = _id;
        }

        if(msg.value > priceTotal) {
            payable(msg.sender).transfer(msg.value - priceTotal);
        }
    }

    /// @dev buying items of a shop bunch.
    /// @param _ids - id's of items to buy
    /// @param _amounts - amount's of items to buy
    function buyFruitBunch(uint256[] memory _ids, uint256[] memory _amounts) external payable {
        require(_ids.length <= _amounts.length, "Lneght of _id's and _amount's are not equal");

        Fruit[] memory _fruits = new Fruit[](_ids.length);
        uint256 priceTotal = 0;
        for(uint256 i = 0; i < _ids.length; ++i) {
            Fruit memory _fruit = fruits[_ids[i]];
            require(bytes(_fruit.fruitType).length  > 0, "Minting non existense fruit");
            require(_fruit.amount - _amounts[i]> 0, "Fruit is out of stock");
            _fruits[i] = _fruit;

            priceTotal += _fruit.price * _amounts[i];
        }

        require(priceTotal <= msg.value, "Amount of ether is less than required");

        uint256 _tokenId = 0;
        for(uint256 i = 0; i < _ids.length; ++i) {
            for(uint256 j = 0; j < _amounts.length; ++j){
                _tokenId = mint(msg.sender);

                _fruits[i].amount -= 1;
                tokenIdtoFruit[_tokenId] = _ids[i];
            }
            fruits[_ids[i]] = _fruits[i];
        }
        
        if(msg.value > priceTotal) {
            payable(msg.sender).transfer(msg.value - priceTotal);
        }
    }

    function getShopItems() public view returns(Fruit[] memory) {
        return fruits;
    }

    /// @dev returns an items uri.
    /// @param _tokenId - tokenId of owned item
    function tokenURI(uint256 _tokenId) public view override returns(string memory) {
        uint256 _fruitId = tokenIdtoFruit[_tokenId];
        return fruits[_fruitId].uri;
    }
    /// @dev burns an item.
    /// @param _tokenId - tokenId of owned item
    function _burn(uint256 _tokenId) internal virtual override {
        uint256 _fruitId = tokenIdtoFruit[_tokenId];
        fruits[_fruitId].amount -= 1;
        delete tokenIdtoFruit[_tokenId];
        super._burn(_tokenId);
    }

    
}