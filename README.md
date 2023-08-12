# Website setup
The website consists of three pages as of now. The index, app, and about pages. The About page is just a template for now and does not contain any information. I've used Bootstrap for designing a few elements. I've also used a few Bootstrap icons on the page. Also, a few of the designs are taken from [Uiverse](https://uiverse.io/all)

The pages contain a header and footer tag that is empty. The information is added to them using the file 'script-info.js'. We take the header and footer info from the html files in the snippets folder. Hence, if there is any need to add the navigation and footer details to other pages in the future then you can simply add header and footer tags and include the file 'script-info.js' to get the required information.

## CSS and JS files Setup
The CSS folder contains many files. Each file is for a separate page. The 'styles-all.css' contains styles for the common elements among the pages. It also has the variables for font and colors included in the root element. It contains styles to remove the scroll bar from the webpage, and to reset the design of some elements like buttons and anchor tags. Styles for the page individually are written in separate files. It's a good idea to include the individual page later in the HTML page as in that way we can apply changes to the elements already included in the styles-all page.

Same as the CSS files, the js files are also separated into different files. Each file does a separate task.
- 'script-app.js': Contains all the functions and requirements needed to run the web application.
- 'script-case-study.js': Adds the blogs and case studies to the home page.
- 'script-info.js': As stated earlier, it adds the footer and header to the pages.
- 'script-scroll.js': Used to animate the elements into view as they are scrolled in.

## Fonts Used
The fonts used on this website are from Google Fonts (imported in the styles-all file). The font family name for each of them is as follows.
- 'DM Serif Display': Title in the banner, Title in the story of the company.
- 'EB Garamond': List headings in the footer, Headings of the industries and services.
- 'Roboto Slab': List items in the navigation bar and the footer and the dropdown.
- 'Roboto': For the rest of the texts.

# Home Page
## Navigation bar
As said earlier, the empty header tag and the script-info file add the header. The HTML file for the header is in "snippets/header.html" It contains a logo (with an anchor tag directing to the home page) and a navigation menu. The navigation is designed using Bootstrap along with the dropdown. It also converts into a toggle switch for smaller screen sizes.

Right now just the About Us and Client Login have anchor tags redirecting them to different pages. The dropdowns are also done using Bootstrap. The logo changes to a compact form for smaller screen sizes. The 2 logos are different files.

## Hero Banner
The banner has a fixed height and a fixed background. there is also a '::before' element used to add a blur to the background image using 'backdrop-filter'. The banner has a title, a small description, and a button. The button is styled using the class 'btn-main'. The idea is to give the class to other buttons that are used on the page.

## Story
The story contains a title and a list along with some satellite images (to be changed). Each list item contains an image at its end. There is a line connecting the images made with the before pseudoclass. 

The images are inside an image container that spans across the whole story div and helps to position the images. The images are positioned using the nth-child selector.

The "skew-bg" class used on the story div is used to give it an inclined background to it. The style is given in the styles-all file.

## Industry
Firstly there is a container for the heading, the description and the cards. alignment is done using "display: flex". The cards are in a container of themselves. The content and image overlap with "display: grid". Text is positioned using "position: absolute".

## Services
Same as industry.

The card designs are taken from [Uiverse](https://uiverse.io/all)

## Case studies and Blogs
The information on the blogs is taken from the "json/case-study.json" file and the HTML from "snippets/case-study.html". Inserting and changes are done by "script-info.js". The JSON and HTML are retrieved and we replace the properties with their values and append it to the final HTML.

## Footer
Similar to the header, the footer file is in the snippets folder. The footer contains a logo and contact details along with services and resources. It is responsive and structured using a "grid". The icons are Bootstrap icons and redirect to the provided page.

# About Page
Just contains the header, banner, and footer.
The banner has a few extra styles in the styles-about file.

# Application Page
## HTML and CSS Layout
The HTML contains 2 main parts a side and a main div. The placement is done on them by applying a grid on the body tag. The main contains just a map for now (planned to add the chart data here too). On the side, there is a navigation with all the controls. There are also a few leaflet controls on the map.

The navigation contains a form to search using the latitude and longitude of a place, an input to select dates, buttons for satellite(visual) images, KPI images, and getting place data, selecting the KPIs and the dates.

Right now the page isn't responsive and the navigation doesn't have an overflow feature.

## Work of the application
### Steps of usage
- First, select the date of interest (set to today's date by default)
- Then select the area by dragging the map to the desired location.
- You can search by coordinates and place's name.
- Then click "Get Satellite Image". The images will be displayed and the map will be zoomed out.
- A toggle will be shown that can hide the image if needed.
- You can select different dates from the dates form to get images for different days.
- Draw a polygon or rectangle around the area of interest and select the KPI you want.
- Click "Get KPI Image" to get the KPI image on the map.
- We can select markers on the map to get the data at those particular points.
- Select the points and click "GEt Point Data" to get the graph.

### Problems as of now
- Geolocation is not very accurate.
- The toggles only work with a single image.
- The change of the visual image with dates was working with the test case and has not been tested with actual API calls.
- The polygon goes at the back of the visual image.
- Right now we can get the KPI image for just one polygon at a time.
- To get multiple KPI images, we can draw one polygon gets its KPI image then draw another and get its KPI.
- Get point data haven't been tested yet. Also, the URL isn't there for now.

### Structure of JS file
Everything needed to run the application is present in the "script-app.js" file. The file starts with 2 functions, one to show the loading animation and the other to hide it. Then there is the map and some global variables declared that will be used throughout.

There are 2 panes with different z-index to keep the KPI image above the visual image at all times.

#### Controls on the map
- Get the current location: [Leaflet Locate Control](https://github.com/domoritz/leaflet-locatecontrol)
- Search for a place by name: [Leaflet Control Geocoder](https://github.com/perliedman/leaflet-control-geocoder)
- Drawing Polygons and Markers: [leaflet.draw](https://github.com/Leaflet/Leaflet.draw)

The draw controls are separated in two, one for the polygons and the other for markers. It was done to add the polygons and the markers into different feature groups.

### Functions and their use
#### failedToLoad()
This function is called when there was no internet connection or if the API call fails for some reason. It alerts the user and hides the loader it is present.

#### Selecting and updates of the days of interest
The next set of functions is used to select days of interest and update them in the global variable and on the site. The selectDates() function is used to change the global variables of days and also on the site.
First, we get the input selector and set it to the current date. Then whenever a date is selected(the input is changed), we check if the input is in the past or not. If it's a past date, the selectDates() is run and the dates are changed accordingly. The dates of interest are stored in "g_days".

#### Getting the visual/satellite image
When we click the "Get satellite Image" button, the bounding box is taken from the map and is stored in "g_bounds". The map is zoomed out a little and we call "setVisualImages()" function.
The setVisualImages function first clears the "g_images" (where data URLs of all the images are stored) and then sends 5 API calls one after another. One API call for each day. The API calls are done in "getVisualImageOverlay" function. True is sent in the first call as the image needs to be overlaid in the map.
The getVisualImageOverlay function sends the API call to the server using fetch. There is also a line to test the application (this adds a random picture as an overlay). Next, we have an alert if the call fails to get the image. Next, we create a file reader to read the blob as a dataURL. Once it is loaded, if it's the first image then we add it to the map, mark the first date and display the image toggle on the site (used to hide and unhide the image). Then the dataURl is pushed into the g_images variable.

##### Changing the visual image 
When we click on the days' form, it searches for the date which is selected and it then changes the image to the corresponding day. It is done as the id of the date is the same as the index of the image in g_images.

##### Toggle of visual image
If the toggle is checked, the layer is added and removed otherwise.

#### Drawing of polygons and markers
Whenever something is drawn, first we check if it's a marker or polygon. If it's a marker, we add a popup to it with the title of a number and its coordinates. If it's a polygon, we add a popup with the coordinates of the vertices.
The pre_process_array function is used to process the array of the coordinates of the polygon.

#### Getting the KPI image
When we click the "Get KPI image" button, we first get the bounding box for the polygon drawn and the coordinates of the polygon. If bbox stays undefined (i.e. no polygon is drawn), then an alert is shown. Also if no KPI is selected, it shows an alert. If everything is good, we call getKpiImage().

##### Selecting the KPI
The selected KPI is stored in the "g_kpi" variable. We can change it using the KPI form.

##### Overlay of the image
Similar to the visual image call (getVisualImageOverlay()). For the bound of the KPI image, we should use the bbox that was defined in the earlier case.

#### Getting the point data
We go to each layer of drawn_markers and get the title and the coordinates of the markers and store it in "g_markers_list". If it is empty, an alert is shown or else, we send the API call by sendData().
The function sendData first, makes the API call and gets the data for the graph. The following lines have a few manipulations of data for the creation of the graph.

