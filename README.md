# Miniswipper Generator
=================

### File Structure

 * CDK
	* css
        * main.css
	* img
	* js
		* app
		* vendor
            * Libraries
           
    * index.html

### Some basic question about file structure 

* Why class.js?
    * I have created this class for creating the class and extending class accordin to need. You don't need to go in main file and add any function it will be extend like below

    * I think this is the best approach and perfect use of OOP. If I want to inherit or extend any of the classes I can easily do. 


* How to use?
    * Add file in HTML.
      ```
        <script
         src="js/app/class.js"></script>
      <script
         src="js/app/mineswipper.js"></script>

      ```
    * Add Container
      ```
        <div class="container main-container"  id="mineswipper">

      </div>
      ```
    * Call class with added container.
      ```

        var mineSwipperGeneratorIns= new mineSwipper.MineSwipperGenerator({
            /**
                * Send only container here where you want to load miniswipper.
                */
            container:'mineswipper'
        });
        ```




### Assumption while creating this project 
* This application is not fully responsive 
* Bundling tool is not used 


### Known Issue



Let me know if you have any questions in this.
