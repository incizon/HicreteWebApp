<?php

class ProductModel{

	public $productName="";
    public $productAbbrevations=""; //The single instance
    public $productUnitOfMeasure="";
    public $productAlertQty="";
    public $productColor="";
    public $productDescription="";
    public $productPackaging="";
    public $productType="";
    public $productOperation="";

    /**
     * [description here]
     *
     * @return [type] [description]
     */
    public function getProductOperation() {
        return $this->productOperation;
    }
    /**
     * [Description]
     *
     * @param [type] $newOperation [description]
     */
    public function _setProductOperation($Operation) {
        $this->productOperation = $Operation;
        return $this;
    }
    public function getProductName()
    {
        return $this->productName;
    }
    public function _setProductName($name)
    {
        $this->productName = $name;

        return $this;
    }
    public function getProductAbbrevations()
    {
        return $this->productAbbrevations;
    }
    public function _setProductAbbrevations($Abbrevations)
    {
        $this->productAbbrevations = $Abbrevations;

        return $this;
    }
    public function getProductUnitOfMeasure()
    {
        return $this->productUnitOfMeasure;
    }
    
    public function _setProductUnitOfMeasure($UnitOfMeasure)
    {
        $this->productUnitOfMeasure = $UnitOfMeasure;

        return $this;
    }
     public function getProductAlertQty()
    {
        return $this->productAlertQty;
    }
    public function _setProductAlertQty($AlertQty)
    {
        $this->productAlertQty = $AlertQty;
        return $this;
    }
    public function getProductColor()
    {
        return $this->productColor;
    }
    public function _setProductColor($Color)
    {
        $this->productColor = $Color;

        return $this;
    }
    public function getProductDescription()
    {
        return $this->productDescription;
    }
    public function _setProductDescription($Description)
    {
        $this->productDescription= $Description;

        return $this;
    }
    public function getProductPackaging()
    {
        return $this->productPackaging;
    }
    public function _setProductPackaging($Packaging)
    {
        $this->productPackaging= $Packaging;

        return $this;
    }
    public function getProductType()
    {
        return $this->productType;
    }
    public function _setProductType($Type)
    {
        $this->productType= $Type;

        return $this;
    }
}
?>
